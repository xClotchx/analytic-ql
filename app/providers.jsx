'use client';
import {SessionProvider} from 'next-auth/react'; import {PrefsProvider} from '@/lib/i18n';
export default function Providers({children}){return <SessionProvider><PrefsProvider>{children}</PrefsProvider></SessionProvider>}
