import {createUser,limit} from '@/lib/users';
export const runtime='nodejs';
const bad=(error,s=400)=>Response.json({error},{status:s});
export async function POST(req){
  try{
    const {name,email,password}=await req.json(), e=String(email||'').trim().toLowerCase(), n=String(name||'').trim().slice(0,60), p=String(password||'');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e)||e.length>120) return bad('invalid_email');
    if(!n) return bad('invalid_name'); if(p.length<8||p.length>100) return bad('weak_password');
    const ip=(req.headers.get('x-forwarded-for')||'x').split(',')[0].trim();
    if(!(await limit('reg:'+ip,5,3600))) return bad('rate',429);
    await createUser({name:n,email:e,password:p}); return Response.json({ok:true});
  }catch(x){return x.message==='EXISTS'?bad('exists',409):x.message==='ACCOUNTS_OFF'?bad('off',503):bad('server',500)}
}
