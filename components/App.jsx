'use client';
import {useState} from 'react'; import dynamic from 'next/dynamic'; import {usePrefs} from '@/lib/i18n';
import ConnectForm from './ConnectForm'; import Sidebar from './Sidebar'; import DataView from './DataView'; import Console from './Console'; import Icon from './Icon';
const Dashboard=dynamic(()=>import('./Dashboard'),{ssr:false,loading:()=><div className="sk big"/>});
const TABS=[['nav','db'],['data','table'],['dash','chart'],['console','terminal']];
export default function App(){
  const {t}=usePrefs(),[info,setInfo]=useState(null),[db,setDb]=useState(''),[table,setTable]=useState(''),[tab,setTab]=useState('data');
  if(!info) return <ConnectForm onConnected={(i,f)=>{setInfo(i);setDb(f.database)}}/>;
  const view=tab==='nav'?'data':tab;
  return <div className="layout" data-tab={tab}>
    <Sidebar info={info} db={db} setDb={setDb} table={table} setTable={setTable} go={setTab}/>
    <section className="main"><nav className="tabs" aria-label="views">{TABS.slice(1).map(([k,ic])=><button key={k} className={tab===k?'on':''} aria-current={tab===k} onClick={()=>setTab(k)}><Icon n={ic} s={16}/>{t('tab.'+k)}</button>)}</nav>
      <div className="view" key={view+db+table}>{view==='data'&&<DataView db={db} table={table}/>}{view==='dash'&&<Dashboard db={db} table={table}/>}{view==='console'&&<Console db={db}/>}</div></section>
    <nav className="bottom glass" aria-label="views">{TABS.map(([k,ic])=><button key={k} className={tab===k?'on':''} aria-current={tab===k} onClick={()=>setTab(k)}><Icon n={ic} s={22}/>{t('tab.'+k)}</button>)}</nav></div>;
}
