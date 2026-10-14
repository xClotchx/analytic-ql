'use client';
import {useEffect,useState} from 'react'; import Link from 'next/link'; import {useSession,signOut} from 'next-auth/react'; import {usePrefs} from '@/lib/i18n'; import Controls from './Controls'; import Icon,{Logo} from './Icon';
export default function Header(){
  const {data}=useSession(),{t}=usePrefs(),[h,setH]=useState(null);
  useEffect(()=>setH(new Date().getHours()),[]);
  const name=data?.user?.name?.split(' ')[0]||data?.user?.email?.split('@')[0]||'';
  return <header className="hdr glass"><Link href="/" aria-label="Analytics QL"><Logo/></Link><span className="greet">{h!==null&&`${t(h<12?'g1':h<19?'g2':'g3')}, ${name}`}</span>
    <div className="ctl"><Controls/><button className="icon-btn" aria-label={t('logout')} onClick={()=>signOut({callbackUrl:'/'})}><Icon n="logout"/></button></div></header>;
}
