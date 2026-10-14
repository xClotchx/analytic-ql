import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
const san=s=>String(s??'').replace(/[^\x20-\xFF]/g,'?').replace(/[\r\n]+/g,' ');
const wrap=(t,f,size,max)=>{const out=[];let l='';for(const w of san(t).split(' ')){const n=l?l+' '+w:w;if(f.widthOfTextAtSize(n,size)>max&&l){out.push(l);l=w}else l=n}if(l)out.push(l);return out};
export async function buildPdf({lang,title,tipo,resumen,recomendaciones=[],serie=[]}){
  const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.Helvetica),b=await d.embedFont(StandardFonts.HelveticaBold);
  const L=lang==='en'?{sub:'AI-generated analytics report',ty:'Detected data type: ',per:'Records per month',rec:'Recommendations'}:{sub:L.sub,ty:L.ty,per:L.per,rec:L.rec};
  const P=rgb(.49,.23,.93); let p,y;
  const page=()=>{p=d.addPage([595,842]);y=800};
  const text=(t,{size=11,font=f,color=rgb(.15,.12,.25)}={})=>{for(const l of wrap(t,font,size,515)){if(y<60)page();p.drawText(l,{x:40,y,size,font,color});y-=size+4}};
  page(); p.drawRectangle({x:0,y:758,width:595,height:84,color:P});
  p.drawText('Analytics QL',{x:40,y:798,size:26,font:b,color:rgb(1,1,1)}); p.drawText(L.sub,{x:40,y:772,size:11,font:f,color:rgb(.92,.88,1)}); y=730;
  text(title,{size:18,font:b}); y-=4; text(L.ty+tipo,{font:b,color:P}); y-=8; text(resumen); y-=14;
  if(serie.length){
    text(L.per,{size:14,font:b}); y-=8; const h=110,max=Math.max(...serie.map(s=>s.n),1),bw=Math.min(36,500/serie.length-6);
    if(y<h+60)page();
    serie.forEach((s,i)=>{const x=40+i*(bw+6);p.drawRectangle({x,y:y-h,width:bw,height:Math.max(2,s.n/max*h),color:P});p.drawText(san(s.mes).slice(2),{x,y:y-h-12,size:7,font:f})});
    y-=h+32;
  }
  text(L.rec,{size:14,font:b}); y-=4; recomendaciones.forEach((r,i)=>text(`${i+1}. ${r}`));
  return Buffer.from(await d.save());
}
