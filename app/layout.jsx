import './globals.css'; import {Fira_Sans,Fira_Code} from 'next/font/google'; import Providers from './providers'; import Bg from '@/components/Bg';
const sans=Fira_Sans({subsets:['latin'],weight:['400','500','600','700'],variable:'--f-sans',display:'swap'});
const mono=Fira_Code({subsets:['latin'],weight:['400','500'],variable:'--f-mono',display:'swap'});
export const metadata={title:'Analytics QL',description:'Explora, analiza y reporta tus bases de datos con IA · Explore, analyze and report your databases with AI'};
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
const init=`try{var d=document.documentElement,t=localStorage.getItem('aql_theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.dataset.theme=t;d.lang=localStorage.getItem('aql_lang')||(navigator.language.startsWith('en')?'en':'es')}catch(e){}`;
export default function Root({children}){
  return <html lang="es" data-theme="dark" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}><head><script dangerouslySetInnerHTML={{__html:init}}/></head><body><Bg/><Providers>{children}</Providers></body></html>;
}
