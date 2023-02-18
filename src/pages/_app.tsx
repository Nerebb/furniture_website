import ToastAlert from '@/components/ToastAlert'
import { SessionProvider } from "next-auth/react"
import '@/styles/app.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastAlert />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
