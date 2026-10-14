import {getServerSession} from 'next-auth'; import {authOptions} from '@/lib/auth'; import * as C from '@/lib/controllers';
export const runtime='nodejs'; export const maxDuration=30;
export async function POST(req){
  try{
    const s=await getServerSession(authOptions); if(!s?.user?.email) return Response.json({error:'No autorizado'},{status:401});
    const b=await req.json(); const fn={connect:C.connect,tables:C.tables,rows:C.rows,query:C.query}[b.action];
    if(!fn) return Response.json({error:'Acción inválida'},{status:400});
    return Response.json(await fn(b,s.user.email));
  }catch(e){return Response.json({error:String(e.message).slice(0,300)},{status:400})}
}
