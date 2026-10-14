'use client';
import Link from 'next/link'; import {usePrefs} from '@/lib/i18n'; import Icon from './Icon';
export default function About(){
  const {t}=usePrefs(),P=['shield','lock','check'];
  return <div>
    <section className="ab-hero"><span className="badge">{t('nav.about')}</span><h1 className="gt">{t('about.t')}</h1><p className="lead">{t('about.lead')}</p></section>
    <section className="two">{[['m','sparkles'],['v','chart']].map(([k,ic])=><article key={k} className="glass lift"><span className="chipi c-a"><Icon n={ic} s={22}/></span><h3>{t(`about.${k}.t`)}</h3><p className="muted">{t(`about.${k}.d`)}</p></article>)}</section>
    <section><h2>{t('about.p.t')}</h2><div className="tri">{[1,2,3].map(i=><article key={i} className="glass lift"><span className="chipi" style={{background:['linear-gradient(135deg,#10b981,#22d3ee)','linear-gradient(135deg,#7c3aed,#2563eb)','linear-gradient(135deg,#db2777,#f97316)'][i-1]}}><Icon n={P[i-1]} s={22}/></span><h3>{t(`ap${i}.t`)}</h3><p className="muted">{t(`ap${i}.d`)}</p></article>)}</div></section>
    <section><h2>{t('about.faq')}</h2><div className="faq">{[1,2,3,4].map(i=><details key={i} className="glass"><summary>{t(`faq${i}.q`)}</summary><p className="muted">{t(`faq${i}.a`)}</p></details>)}</div></section>
    <section className="cta glass"><h2>{t('cta.t')}</h2><Link className="btn big" href="/login?mode=register">{t('cta.b')} <Icon n="arrow" s={18}/></Link></section></div>;
}
