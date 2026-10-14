'use client';
import {useState} from 'react'; import {api} from '@/lib/client'; import {usePrefs} from '@/lib/i18n'; import Icon from './Icon';
import {Chart,CategoryScale,LinearScale,BarElement,LineElement,PointElement,Tooltip,Legend} from 'chart.js'; import {Bar,Line} from 'react-chartjs-2';
Chart.register(CategoryScale,LinearScale,BarElement,LineElement,PointElement,Tooltip,Legend);
const PAL=['#8b5cf6','#3b82f6','#22d3ee','#e879f9','#fb7185','#10b981'];
export default function Dashboard({db,table}){
  const {t,lang,theme}=usePrefs(),[a,setA]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
  if(!table) return <p className="muted">{t('dash.pick')}</p>;
  const go=async()=>{setBusy(true);setErr('');setMsg('');try{setA(await api('/api/analyze',{db,table,lang}))}catch(e){setErr(e.message)}setBusy(false)};
  const send=async()=>{setBusy(true);setErr('');try{const r=await api('/api/report',{title:`${db}.${table}`,analysis:a});setMsg(t('dash.sent',{to:r.to}))}catch(e){setErr(e.message)}setBusy(false)};
  const tc=theme==='dark'?'#aaa4d6':'#575082',gc=theme==='dark'?'rgba(255,255,255,.08)':'rgba(80,60,200,.12)';
  const opt={responsive:true,plugins:{legend:{labels:{color:tc}}},scales:{x:{ticks:{color:tc},grid:{color:gc}},y:{ticks:{color:tc},grid:{color:gc}}}};
  const labels=a?.serie.map(s=>s.mes)||[];
  return <><div className="row"><button className="btn" disabled={busy} onClick={go}><Icon n="sparkles" s={18}/> {busy&&!a?t('dash.going'):t('dash.go')}</button>{a&&<button className="btn2" disabled={busy} onClick={send}><Icon n="mail" s={18}/> {busy?t('dash.sending'):t('dash.send')}</button>}</div>
    {busy&&!a&&<div role="status"><div className="sk big"/><div className="sk"/></div>}{err&&<p className="err" role="alert">{err}</p>}{msg&&<p className="ok" role="status"><Icon n="check" s={16}/> {msg}</p>}
    {a&&<div className="view"><span className="badge">{a.tipo}</span><p>{a.resumen}</p>
      {a.serie.length>0?<div className="charts"><div className="glass lift" role="img" aria-label={t('dash.perm')}><h4>{t('dash.perm')}</h4><Bar options={opt} data={{labels,datasets:[{label:t('dash.rec'),data:a.serie.map(s=>s.n),backgroundColor:a.serie.map((_,i)=>PAL[i%PAL.length]),borderRadius:6}]}}/></div>
        {a.numCol&&<div className="glass lift" role="img" aria-label={t('dash.sum',{c:a.numCol})}><h4>{t('dash.sum',{c:a.numCol})}</h4><Line options={opt} data={{labels,datasets:[{label:a.numCol,data:a.serie.map(s=>s.total),borderColor:'#22d3ee',backgroundColor:'rgba(34,211,238,.18)',fill:true,tension:.35}]}}/></div>}</div>:<p className="muted">{t('dash.nodate')}</p>}
      <h4>{t('dash.recs')}</h4><ul className="recs">{a.recomendaciones.map((r,i)=><li key={i} className="glass"><Icon n="sparkles" s={16}/> {r}</li>)}</ul></div>}</>;
}
