'use client';
import {useSession} from 'next-auth/react'; import Header from '@/components/Header'; import App from '@/components/App';
export default function Panel(){
  const {status}=useSession();
  if(status!=='authenticated') return <div className="center" role="status"><div className="spin"/></div>;
  return <><Header/><App/></>;
}
