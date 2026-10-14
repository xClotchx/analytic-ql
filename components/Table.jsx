'use client';
import {usePrefs} from '@/lib/i18n';
export default function Table({rows}){
  const {t}=usePrefs(); if(!rows.length) return <p className="muted">{t('empty')}</p>;
  const cols=Object.keys(rows[0]);
  return <div className="tw" tabIndex={0}><table><thead><tr>{cols.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{cols.map(c=>{const v=r[c],s=v==null?'':typeof v==='object'?JSON.stringify(v):String(v);return <td key={c} className={/^\*+$/.test(s)?'mk':''}>{s}</td>})}</tr>)}</tbody></table></div>;
}
