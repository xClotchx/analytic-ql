import pg from 'pg'; import mysql from 'mysql2/promise'; import {cookies} from 'next/headers'; import {open} from './crypto';
export function getConn(email){
  const v=cookies().get('aql_conn')?.value; if(!v) throw new Error('Sin conexión activa. Conéctate primero.');
  let o; try{o=open(v)}catch{throw new Error('Conexión expirada, vuelve a conectar')}
  if(o.email!==email) throw new Error('Conexión inválida'); return o;
}
// Ejecuta fn(q, engine) en una sesión SOLO LECTURA con timeout. Nunca descarga la BD completa.
export async function withDb(c,database,fn){
  const base={host:c.host,port:+c.port,user:c.user,password:c.password,database:database||c.database};
  if(c.engine==='postgres'){
    const cl=new pg.Client({...base,connectionTimeoutMillis:8000,ssl:c.ssl?{rejectUnauthorized:false}:false});
    await cl.connect();
    try{await cl.query('BEGIN READ ONLY');await cl.query('SET LOCAL statement_timeout=8000');return await fn(async s=>(await cl.query(s)).rows,'postgres')}
    finally{await cl.query('ROLLBACK').catch(()=>{});await cl.end().catch(()=>{})}
  }
  const cn=await mysql.createConnection({...base,connectTimeout:8000,ssl:c.ssl?{rejectUnauthorized:false}:undefined});
  try{await cn.query('SET SESSION TRANSACTION READ ONLY').catch(()=>{});await cn.query('SET SESSION MAX_EXECUTION_TIME=8000').catch(()=>{});
    return await fn(async s=>(await cn.query(s))[0],'mysql')}
  finally{await cn.end().catch(()=>{})}
}
