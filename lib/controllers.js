import {cookies} from 'next/headers'; import {seal} from './crypto'; import {getConn,withDb} from './db';
import {maskRows} from './mask'; import {dqlToSql} from './dql'; import {gemini} from './ai';
const ID=/^[\w$]+$/, PRIV=/^(localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1)/i;
const listTables=(q,eng)=>eng==='postgres'
  ?q(`select c.relname as name, c.reltuples::bigint as est from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname='public' order by 1`)
  :q(`select table_name as name, table_rows as est from information_schema.tables where table_schema=database() and table_type='BASE TABLE' order by 1`);
const quoter=eng=>n=>(eng==='postgres'?'"':'`')+n+(eng==='postgres'?'"':'`');

export async function connect(b,email){
  const my=b.engine==='mysql';
  const c={engine:my?'mysql':'postgres',host:String(b.host||'').trim(),port:+b.port||(my?3306:5432),database:String(b.database||'').trim(),user:String(b.user||''),password:String(b.password||''),ssl:!!b.ssl,email};
  if(!c.host||!c.user||!c.database) throw new Error('Completa host, base de datos y usuario');
  if(PRIV.test(c.host)) throw new Error('Vercel no alcanza localhost ni IPs privadas. Expón tu BD con un túnel (ngrok / cloudflared) y usa ese host público.');
  const info=await withDb(c,null,async(q,eng)=>{
    if(eng==='postgres'){
      const [r]=await q(`select rolsuper, rolcreatedb, rolcreaterole from pg_roles where rolname=current_user`);
      const [p]=await q(`select has_database_privilege(current_database(),'CREATE') as cr`);
      const databases=(await q(`select datname as name from pg_database where not datistemplate and has_database_privilege(datname,'CONNECT') order by 1`)).map(x=>x.name);
      return {role:r.rolsuper?'superuser':'standard',privileges:['CONNECT',...(p.cr?['CREATE']:[]),...(r.rolcreatedb?['CREATEDB']:[]),...(r.rolcreaterole?['CREATEROLE']:[])],databases,warn:!!(r.rolsuper||p.cr)};
    }
    const grants=(await q('SHOW GRANTS')).map(x=>Object.values(x)[0]);
    const databases=(await q(`select schema_name as name from information_schema.schemata where schema_name not in ('information_schema','mysql','performance_schema','sys') order by 1`)).map(x=>x.name);
    return {role:grants.some(g=>/ALL PRIVILEGES ON \*\.\*/i.test(g))?'admin':'limited',privileges:grants,databases,warn:grants.some(g=>/(INSERT|UPDATE|DELETE|DROP|ALL PRIVILEGES)/i.test(g))};
  });
  cookies().set('aql_conn',seal(c),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:28800});
  return info;
}
export async function tables(b,email){
  return withDb(getConn(email),b.db,async(q,eng)=>({tables:(await listTables(q,eng)).map(t=>({name:t.name,est:Number(t.est)||0}))}));
}
export async function rows(b,email){
  return withDb(getConn(email),b.db,async(q,eng)=>{
    const t=(await listTables(q,eng)).find(x=>x.name===b.table); if(!t) throw new Error('Tabla no encontrada');
    const page=Math.max(0,+b.page||0), data=await q(`select * from ${quoter(eng)(t.name)} limit 25 offset ${page*25}`);
    return {rows:maskRows(data),page,hasMore:data.length===25};
  });
}
export async function query(b,email){
  return withDb(getConn(email),b.db,async(q,eng)=>{
    let sql=String(b.sql||'').trim();
    if(b.mode==='dql') sql=dqlToSql(sql,(await listTables(q,eng)).map(x=>x.name),quoter(eng));
    sql=sql.replace(/;\s*$/,'');
    if(sql.includes(';')) throw new Error('Solo una sentencia por consulta');
    if(!/^(select|with|show|explain|describe)\b/i.test(sql)) throw new Error('Solo consultas de lectura (SELECT/WITH/SHOW/EXPLAIN)');
    const run=/^(select|with)\b/i.test(sql)?`select * from (${sql}\n) as aql_q limit 500`:sql;
    return {rows:maskRows(await q(run)).slice(0,500),sql};
  });
}
export async function analyze(b,email){
  return withDb(getConn(email),b.db,async(q,eng)=>{
    const t=String(b.table||''); if(!ID.test(t)) throw new Error('Tabla inválida');
    const pgS=eng==='postgres', Q=quoter(eng), sch=pgS?`table_schema='public'`:`table_schema=database()`;
    const cols=(await q(`select column_name as c, data_type as t from information_schema.columns where ${sch} and table_name='${t}'`)).filter(x=>ID.test(x.c));
    if(!cols.length) throw new Error('Tabla no encontrada');
    const dc=cols.find(x=>/date|timestamp/i.test(x.t)), nc=cols.find(x=>/int|numeric|decimal|double|real|float|money/i.test(x.t)&&!/(^id$|_id$|^id_)/i.test(x.c));
    let serie=[];
    if(dc){
      const d=Q(dc.c), v=nc?Q(nc.c):null;
      const sql=pgS?`select to_char(date_trunc('month',${d}),'YYYY-MM') as mes, count(*)::int as n, ${v?`coalesce(sum(${v}),0)::float`:'0'} as total from ${Q(t)} where ${d} is not null group by 1 order by 1 desc limit 12`
        :`select date_format(${d},'%Y-%m') as mes, count(*) as n, ${v?`ifnull(sum(${v}),0)`:'0'} as total from ${Q(t)} where ${d} is not null group by 1 order by 1 desc limit 12`;
      serie=(await q(sql)).map(r=>({mes:r.mes,n:Number(r.n),total:Number(r.total)})).reverse();
    }
    const meta=await q(pgS?`select table_name as t, string_agg(column_name,',') as c from information_schema.columns where table_schema='public' group by 1 order by 1 limit 40`
      :`select table_name as t, group_concat(column_name) as c from information_schema.columns where table_schema=database() group by 1 order by 1 limit 40`);
    // La IA solo recibe METADATOS y agregados mensuales, nunca filas.
    const ai=await gemini(`Eres analista de datos. Con SOLO este esquema y agregados mensuales de la tabla "${t}" (columna fecha: ${dc?.c||'ninguna'}, columna numérica: ${nc?.c||'ninguna'}), responde en ${b.lang==='en'?'inglés':'español'} un JSON: {"tipo":"finanzas|inventario|usuarios|logistica|ventas|otro","resumen":"2-3 frases","recomendaciones":["3 a 5 recomendaciones accionables"]}.\nEsquema: ${JSON.stringify(meta)}\nSerie mensual: ${JSON.stringify(serie)}`);
    return {lang:b.lang==='en'?'en':'es',tipo:String(ai.tipo||'otro'),resumen:String(ai.resumen||''),recomendaciones:(ai.recomendaciones||[]).map(String),serie,dateCol:dc?.c||null,numCol:nc?.c||null};
  });
}
