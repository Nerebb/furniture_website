import ToastAlert from '@/components/ToastAlert';
import '../styles/App.scss';
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import WishListProvider from '@/contexts/wishListContext';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          <WishListProvider>
            <ThemeProvider attribute='class'>
              <ToastAlert />
              <Component {...pageProps} />
            </ThemeProvider>
          </WishListProvider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider >
  )
}
