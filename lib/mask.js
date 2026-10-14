const COL=/pass|pwd|hash|secret|token|mail|correo|phone|tel|cel|mobile|card|tarjeta|cvv|iban|ssn|dni|cedula|curp|rfc|address|direccion|birth|nacimiento|salary|salario/i;
const VAL=[/^[^@\s]+@[^@\s]+\.\w+$/,/^\+?[\d\s().-]{9,}$/,/^(?:\d[ -]?){13,19}$/];
export function maskVal(k,v){
  if(v==null)return v; const s=typeof v==='object'?JSON.stringify(v):String(v);
  if(COL.test(k)||(!/^\d{4}-\d{2}-\d{2}/.test(s)&&VAL.some(r=>r.test(s)))) return '*'.repeat(Math.min(Math.max(s.length,6),24));
  return v;
}
export const maskRows=r=>r.map(o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,maskVal(k,v)])));
