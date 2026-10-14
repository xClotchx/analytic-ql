'use client';
import {usePrefs} from '@/lib/i18n'; import Icon from './Icon';
export default function Controls(){
  const {lang,setLang,theme,setTheme,t}=usePrefs();
  return <div className="ctl"><div className="seg" role="group" aria-label={t('lang')}>{['es','en'].map(l=><button key={l} aria-pressed={lang===l} className={lang===l?'on':''} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
    <button className="icon-btn" aria-label={t(theme==='dark'?'toLight':'toDark')} onClick={()=>setTheme(theme==='dark'?'light':'dark')}><Icon n={theme==='dark'?'sun':'moon'}/></button></div>;
}
