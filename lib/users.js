import {Redis} from '@upstash/redis'; import bcrypt from 'bcryptjs';
const r=()=>{if(!process.env.UPSTASH_REDIS_REST_URL)throw new Error('ACCOUNTS_OFF');return new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN})};
export async function createUser({name,email,password}){
  const ok=await r().set('user:'+email,JSON.stringify({name,hash:await bcrypt.hash(password,10)}),{nx:true}); if(!ok) throw new Error('EXISTS');
}
export async function verifyUser(email,password){
  const v=await r().get('user:'+email.toLowerCase()); if(!v) return null; const u=typeof v==='string'?JSON.parse(v):v;
  return (await bcrypt.compare(password,u.hash))?{id:email.toLowerCase(),email:email.toLowerCase(),name:u.name}:null;
}
export async function limit(key,max,sec){const db=r(),k='rl:'+key,n=await db.incr(k);if(n===1)await db.expire(k,sec);return n<=max}
