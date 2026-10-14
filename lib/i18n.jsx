'use client';
import {createContext,useContext,useEffect,useState,useCallback} from 'react'; import {DICT} from './dict';
const Ctx=createContext(null);
export function PrefsProvider({children}){
  const [lang,setL]=useState('es'),[theme,setT]=useState('dark');
  useEffect(()=>{setL(localStorage.getItem('aql_lang')||(navigator.language.startsWith('en')?'en':'es'));setT(document.documentElement.dataset.theme||'dark')},[]);
  const setLang=l=>{setL(l);localStorage.setItem('aql_lang',l);document.documentElement.lang=l};
  const setTheme=t=>{setT(t);localStorage.setItem('aql_theme',t);document.documentElement.dataset.theme=t};
  const t=useCallback((k,v)=>{let s=DICT[lang][k]??DICT.es[k]??k;if(v)for(const x in v)s=s.replace(`{${x}}`,v[x]);return s},[lang]);
  return <Ctx.Provider value={{lang,setLang,theme,setTheme,t}}>{children}</Ctx.Provider>;
}
export const usePrefs=()=>useContext(Ctx);
