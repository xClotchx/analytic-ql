import {getServerSession} from 'next-auth'; import {authOptions} from '@/lib/auth'; import {buildPdf} from '@/lib/pdf'; import {sendReport} from '@/lib/mail';
export const runtime='nodejs'; export const maxDuration=30;
export async function POST(req){
  try{const s=await getServerSession(authOptions); if(!s?.user?.email) return Response.json({error:'No autorizado'},{status:401});
    const {title,analysis}=await req.json(); if(!analysis?.resumen) throw new Error('Genera primero el análisis');
    const pdf=await buildPdf({title,...analysis});
    await sendReport({to:s.user.email,name:s.user.name||s.user.email.split('@')[0],title,analysis,pdf});
    return Response.json({sent:true,to:s.user.email});
  }catch(e){return Response.json({error:String(e.message).slice(0,300)},{status:400})}
}
