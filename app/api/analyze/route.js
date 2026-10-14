import {getServerSession} from 'next-auth'; import {authOptions} from '@/lib/auth'; import {analyze} from '@/lib/controllers';
export const runtime='nodejs'; export const maxDuration=30;
export async function POST(req){
  try{const s=await getServerSession(authOptions); if(!s?.user?.email) return Response.json({error:'No autorizado'},{status:401});
    return Response.json(await analyze(await req.json(),s.user.email));
  }catch(e){return Response.json({error:String(e.message).slice(0,300)},{status:400})}
}
