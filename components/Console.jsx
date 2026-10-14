'use client';
import {useState} from 'react'; import {api} from '@/lib/client'; import {usePrefs} from '@/lib/i18n'; import Table from './Table'; import Pager from './Pager';
export default function Console({db}){
  const {t}=usePrefs(),[mode,setMode]=useState('sql'),[sql,setSql]=useState(''),[res,setRes]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[page,setPage]=useState(0);
  const run=async()=>{setBusy(true);setErr('');setPage(0);try{setRes(await api('/api/db',{action:'query',db,mode,sql}))}catch(e){setErr(e.message);setRes(null)}setBusy(false)};
  return <><div className="row"><label>{t('con.lang')}<select value={mode} onChange={e=>setMode(e.target.value)}><option value="sql">SQL</option><option value="dql">DQL</option></select></label><button className="btn" disabled={busy||!sql} onClick={run}>{busy?t('con.running'):t('con.run')}</button></div>
    <textarea aria-label="query" rows={5} value={sql} onChange={e=>setSql(e.target.value)} placeholder={t('con.ph.'+mode)} spellCheck={false}/>
    {mode==='dql'&&<p className="muted">{t('con.dql')}</p>}{err&&<p className="err" role="alert">{err}</p>}
    {res&&<><p className="muted">{t('con.rows',{n:res.rows.length})}</p><Table rows={res.rows.slice(page*25,page*25+25)}/><Pager page={page} setPage={setPage} more={(page+1)*25<res.rows.length}/></>}</>;
}
