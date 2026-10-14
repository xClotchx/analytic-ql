'use client';
import {useEffect,useState} from 'react'; import {api} from '@/lib/client'; import {usePrefs} from '@/lib/i18n'; import Icon from './Icon';
export default function Sidebar({info,db,setDb,table,setTable,go}){
  const {t}=usePrefs(),[q,setQ]=useState(''),[tables,setTables]=useState(null);
  useEffect(()=>{setTables(null);api('/api/db',{action:'tables',db}).then(r=>setTables(r.tables)).catch(()=>setTables([]))},[db]);
  const m=s=>s.toLowerCase().includes(q.toLowerCase());
  return <aside className="sidebar glass">
    <div className="role"><b><Icon n="shield" s={16}/> {t('role.'+info.role)}</b><small>{info.privileges.slice(0,4).join(' · ')}</small>{info.warn&&<small className="warn"><Icon n="alert" s={14}/> {t('side.warn')}</small>}</div>
    <div className="sbox"><Icon n="search" s={16}/><input aria-label={t('side.search')} placeholder={t('side.search')} value={q} onChange={e=>setQ(e.target.value)}/></div>
    <h4>{t('side.dbs')}</h4><ul>{info.databases.filter(m).map(d=><li key={d}><button className={d===db?'on':''} onClick={()=>{setDb(d);setTable('')}}><Icon n="db" s={16}/>{d}</button></li>)}</ul>
    <h4>{t('side.tbls')}</h4>{tables===null?<><div className="sk"/><div className="sk"/><div className="sk"/></>:<ul>{tables.filter(x=>m(x.name)).map(x=><li key={x.name}><button className={x.name===table?'on':''} onClick={()=>{setTable(x.name);go('data')}}><Icon n="table" s={16}/>{x.name}<small>~{x.est.toLocaleString()}</small></button></li>)}</ul>}
  </aside>;
}
