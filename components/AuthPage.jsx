'use client';
import {useState,useEffect} from 'react'; import Link from 'next/link'; import {useSearchParams,useRouter} from 'next/navigation'; import {signIn,useSession} from 'next-auth/react';
import {usePrefs} from '@/lib/i18n'; import {api} from '@/lib/client'; import Icon from './Icon';
const KNOWN=['creds','invalid_email','invalid_name','weak_password','exists','off','rate','server'];
export default function AuthPage(){
  const {t}=usePrefs(),sp=useSearchParams(),router=useRouter(),{status}=useSession();
  const [mode,setMode]=useState(sp.get('mode')==='register'?'register':'login'),[f,setF]=useState({name:'',email:'',password:''}),[show,setShow]=useState(false),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{if(status==='authenticated')router.replace('/app')},[status,router]);
  const set=k=>e=>setF({...f,[k]:e.target.value}), reg=mode==='register';
  const submit=async e=>{e.preventDefault();setBusy(true);setErr('');
    try{if(reg)await api('/api/register',f);const r=await signIn('credentials',{email:f.email,password:f.password,redirect:false});if(r?.error)throw new Error('creds');router.push('/app')}
    catch(x){setErr(KNOWN.includes(x.message)?x.message:'server');setBusy(false)}};
  return <section className="authwrap"><div className="glass auth view">
    <div className="seg2" role="tablist">{['login','register'].map(m=><button key={m} role="tab" aria-selected={mode===m} className={mode===m?'on':''} onClick={()=>{setMode(m);setErr('')}}>{t('auth.tab.'+m)}</button>)}</div>
    <h1>{t(`auth.${mode}.t`)}</h1><p className="muted">{t(`auth.${mode}.s`)}</p>
    <button type="button" className="btn2 big full" onClick={()=>signIn('google',{callbackUrl:'/app'})}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9a6 6 0 0 1 0-12c1.9 0 3.1.8 3.8 1.5l2.6-2.5A9.6 9.6 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.8 0-.7-.1-1.2-.2-1.7z"/></svg>{t('google')}</button>
    <div className="or"><span>{t('auth.or')}</span></div>
    <form onSubmit={submit}>
      {reg&&<label>{t('auth.name')}<input required value={f.name} onChange={set('name')} autoComplete="name" maxLength={60}/></label>}
      <label>{t('auth.email')}<input required type="email" value={f.email} onChange={set('email')} autoComplete="email"/></label>
      <label>{t('auth.pass')}<span className="pw"><input required type={show?'text':'password'} minLength={reg?8:undefined} value={f.password} onChange={set('password')} autoComplete={reg?'new-password':'current-password'}/><button type="button" className="icon-btn" aria-label={t(show?'auth.hide':'auth.show')} onClick={()=>setShow(!show)}><Icon n={show?'eyeoff':'eye'}/></button></span></label>
      {reg&&<p className="muted">{t('auth.hint')}</p>}
      {err&&<p className="err" role="alert"><Icon n="alert" s={16}/> {t('err.'+err)}</p>}
      <button className="btn big full" disabled={busy}>{busy?t('auth.busy'):t('auth.go.'+mode)}</button></form>
    <p className="center-t"><Link href="/">{t('auth.back')}</Link></p></div></section>;
}
