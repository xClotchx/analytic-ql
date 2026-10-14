'use client';
import {useRef} from 'react'; import Link from 'next/link'; import {usePrefs} from '@/lib/i18n'; import Controls from './Controls'; import Icon,{Logo} from './Icon';
const BARS=[['#8b5cf6',40],['#3b82f6',62],['#22d3ee',48],['#e879f9',80],['#fb7185',66],['#10b981',92]];
function Mockup(){
  const {t}=usePrefs(),ref=useRef();
  const mv=e=>{const r=ref.current.getBoundingClientRect();ref.current.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*16+'deg');ref.current.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*12+'deg')};
  const lv=()=>{ref.current.style.setProperty('--ry','-8deg');ref.current.style.setProperty('--rx','6deg')};
  return <div className="mock" ref={ref} onPointerMove={mv} onPointerLeave={lv} aria-hidden="true">
    <div className="layer l1 glass"><small>{t('mock.chart')}</small><div className="bars">{BARS.map(([c,h],i)=><i key={i} style={{background:c,height:h+'%'}}/>)}</div></div>
    <div className="layer l2 glass"><table><tbody><tr><td>Ana</td><td className="mk">***********</td><td className="mk">**** **** ****</td></tr><tr><td>Luis</td><td className="mk">************</td><td className="mk">**** **** ****</td></tr><tr><td>Marta</td><td className="mk">**********</td><td className="mk">**** **** ****</td></tr></tbody></table></div>
    <div className="layer l3 glass chip"><Icon n="sparkles"/>{t('mock.ai')}</div>
    <div className="layer l4 glass chip ok"><Icon n="shield"/>{t('mock.ro')}</div></div>;
}
const F=[['sec','shield','sec'],['ai','sparkles','ai'],['con','terminal','con'],['ana','chart','ana'],['cn','plug','cn'],['rep','mail','rep']];
export default function Landing(){
  const {t}=usePrefs();
  return <div>
    
    <section className="hero"><div className="hero-txt view"><span className="badge ok-b"><Icon n="check" s={14}/> {t('hero.badge')}</span>
      <h1>{t('hero.t1')} <span className="gt">{t('hero.t2')}</span></h1><p className="lead">{t('hero.sub')}</p>
      <div className="row"><Link className="btn big" href="/login?mode=register">{t('nav.register')} <Icon n="arrow" s={18}/></Link><Link className="btn2 big" href="/about">{t('nav.about')}</Link></div></div><Mockup/></section>
    <section className="metrics">{[1,2,3].map(i=><div key={i} className="glass lift"><b className="gt">{t('mt'+i+'v')}</b><span>{t('mt'+i)}</span></div>)}</section>
    <section id="features"><h2>{t('feat.title')}</h2><div className="bento">{F.map(([k,ic,c])=><article key={k} className={`glass lift f-${c}`}><span className="chipi"><Icon n={ic} s={22}/></span><h3>{t(`f.${k}.t`)}</h3><p>{t(`f.${k}.d`)}</p>
      {k==='sec'&&<p className="demo" aria-hidden="true">ana@mail.com <Icon n="arrow" s={14}/> <span className="mk">***********</span></p>}</article>)}</div></section>
    <section><h2>{t('how.t')}</h2><ol className="how">{[1,2,3].map(i=><li key={i} className="glass lift"><span className="num">{i}</span><h3>{t(`how${i}.t`)}</h3><p>{t(`how${i}.d`)}</p></li>)}</ol></section>
    <section className="cta glass"><h2>{t('cta.t')}</h2><Link className="btn big" href="/login?mode=register">{t('cta.b')} <Icon n="arrow" s={18}/></Link></section>
  </div>;
}
