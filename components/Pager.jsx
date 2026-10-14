'use client';
import {usePrefs} from '@/lib/i18n';
export default function Pager({page,setPage,more}){const {t}=usePrefs();
  return <div className="pager"><button className="btn2" disabled={page===0} onClick={()=>setPage(page-1)}>{t('prev')}</button><span>{t('page',{n:page+1})}</span><button className="btn2" disabled={!more} onClick={()=>setPage(page+1)}>{t('next')}</button></div>}
