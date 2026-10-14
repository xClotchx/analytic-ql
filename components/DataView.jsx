'use client';
import {useEffect,useState} from 'react'; import {api} from '@/lib/client'; import {usePrefs} from '@/lib/i18n'; import Table from './Table'; import Pager from './Pager';
export default function DataView({db,table}){
  const {t}=usePrefs(),[page,setPage]=useState(0),[d,setD]=useState(null),[err,setErr]=useState('');
  useEffect(()=>{if(!table)return;setD(null);setErr('');api('/api/db',{action:'rows',db,table,page}).then(setD).catch(e=>setErr(e.message))},[db,table,page]);
  if(!table) return <p className="muted">{t('data.pick')}</p>; if(err) return <p className="err" role="alert">{err}</p>;
  if(!d) return <div role="status"><div className="sk big"/><div className="sk"/><div className="sk"/></div>;
  return <><h3>{table} <small className="muted">· {t('data.masked')}</small></h3><Table rows={d.rows}/><Pager page={page} setPage={setPage} more={d.hasMore}/></>;
}
