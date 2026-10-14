'use client';
import {useEffect} from 'react'; import Link from 'next/link'; import {usePathname} from 'next/navigation'; import {useSession} from 'next-auth/react'; import {usePrefs} from '@/lib/i18n'; import Controls from './Controls'; import {Logo} from './Icon';
const LINKS=[['/','nav.home'],['/about','nav.about'],['/#features','nav.features']];
export default function PublicShell({children}){
  const {t}=usePrefs(),{status}=useSession(),p=usePathname();
  useEffect(()=>{ // revelado suave de secciones al hacer scroll
    document.body.classList.add('rv-on');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
    document.querySelectorAll('.land section').forEach(s=>io.observe(s)); return()=>io.disconnect();
  },[p]);
  return <><a className="skip" href="#main">Skip to content</a>
    <header className="hdr glass"><Link href="/" aria-label="Analytics QL"><Logo/></Link>
      <nav className="pnav" aria-label="main">{LINKS.map(([h,k])=><Link key={h} href={h} aria-current={p===h?'page':undefined} className={p===h?'on':''}>{t(k)}</Link>)}</nav>
      <div className="ctl"><Controls/>{status==='authenticated'?<Link className="btn" href="/app">{t('nav.panel')}</Link>:<><Link className="btn2 hide-sm" href="/login">{t('signin')}</Link><Link className="btn" href="/login?mode=register">{t('nav.register')}</Link></>}</div></header>
    <main key={p} id="main" className="land view">{children}</main>
    <footer className="foot">{t('foot')} · Analytics QL · <Link href="/about">{t('nav.about')}</Link> · <Link href="/login">{t('foot.login')}</Link></footer></>;
}
