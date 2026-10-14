// Subconjunto de DQL (Doctrine): SELECT x FROM Entidad x [WHERE|GROUP BY|ORDER BY|LIMIT]. Entidad = tabla (sin joins por relaciones).
export function dqlToSql(dql,tables,quote){
  const src=dql.trim().replace(/;$/,'');
  if(/\bjoin\b/i.test(src)) throw new Error('DQL con JOIN por relaciones no soportado; usa modo SQL');
  const m=/^select\s+(.+?)\s+from\s+([\w\\]+)(?:\s+(?:as\s+)?(\w+))?(\s+[\s\S]*)?$/i.exec(src);
  if(!m) throw new Error('DQL no válido. Ej: SELECT u FROM Users u WHERE u.id > 10');
  let [,sel,ent,al,rest='']=m;
  if(al&&/^(where|order|group|having|limit)$/i.test(al)){rest=' '+al+rest;al=null}
  const n=s=>s.toLowerCase().replace(/_/g,''),e=ent.split('\\').pop();
  const t=tables.find(x=>n(x)===n(e))||tables.find(x=>n(x)===n(e)+'s');
  if(!t) throw new Error('Entidad no encontrada: '+ent);
  const a=al||'e';
  const cols=sel.split(',').map(x=>x.trim()).map(x=>x===a?`${a}.*`:x).join(', ');
  return `SELECT ${cols} FROM ${quote(t)} ${a}${rest}`;
}
