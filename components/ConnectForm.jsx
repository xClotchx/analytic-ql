'use client';
import {useState} from 'react'; import {api} from '@/lib/client'; import {usePrefs} from '@/lib/i18n'; import Icon from './Icon';
export default function ConnectForm({onConnected}){
  const {t}=usePrefs(),[f,setF]=useState({engine:'postgres',host:'',port:'5432',database:'',user:'',password:'',ssl:true}),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  const set=k=>e=>setF({...f,[k]:e.target.type==='checkbox'?e.target.checked:e.target.value});
  const submit=async e=>{e.preventDefault();setBusy(true);setErr('');try{onConnected(await api('/api/db',{action:'connect',...f}),f)}catch(x){setErr(x.message)}setBusy(false)};
  return <main className="center view"><form className="glass connect" onSubmit={submit}>
    <h2><Icon n="plug"/> {t('conn.t')}</h2><p className="muted">{t('conn.hint')}</p>
    <label>{t('conn.engine')}<select value={f.engine} onChange={e=>setF({...f,engine:e.target.value,port:e.target.value==='mysql'?'3306':'5432'})}><option value="postgres">PostgreSQL</option><option value="mysql">MySQL / MariaDB</option></select></label>
    <div className="row"><label style={{flex:3}}>{t('conn.host')}<input required value={f.host} onChange={set('host')} placeholder="db.example.com" autoComplete="off"/></label><label style={{flex:1}}>{t('conn.port')}<input required inputMode="numeric" value={f.port} onChange={set('port')}/></label></div>
    <label>{t('conn.db')}<input required value={f.database} onChange={set('database')} autoComplete="off"/></label>
    <label>{t('conn.user')}<input required value={f.user} onChange={set('user')} autoComplete="off"/></label>
    <label>{t('conn.pass')}<input type="password" value={f.password} onChange={set('password')} autoComplete="new-password"/></label>
    <label className="chk"><input type="checkbox" checked={f.ssl} onChange={set('ssl')}/> {t('conn.ssl')}</label>
    {err&&<p className="err" role="alert"><Icon n="alert" s={16}/> {err}</p>}<button className="btn big" disabled={busy}>{busy?t('conn.going'):t('conn.go')}</button></form></main>;
}
