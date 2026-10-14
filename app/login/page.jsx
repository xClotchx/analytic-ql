import {Suspense} from 'react'; import PublicShell from '@/components/PublicShell'; import AuthPage from '@/components/AuthPage';
export const metadata={title:'Acceso · Sign in — Analytics QL'};
export default function Page(){return <PublicShell><Suspense fallback={null}><AuthPage/></Suspense></PublicShell>}
