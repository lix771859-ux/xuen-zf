// 'use client';

// import { I18nProvider } from '@/i18n/context';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <I18nProvider>{children}</I18nProvider>;
// }

'use client'

import { SWRConfig } from 'swr'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: false,
        revalidateIfStale: false,
        dedupingInterval: 2000,
      }}
    >
      <ServiceWorkerRegistration />
      {children}
    </SWRConfig>
  )
}
