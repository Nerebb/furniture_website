import ToastAlert from '@/components/ToastAlert';
import '@/styles/app.scss';
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app';
import SearchProvider from '@/contexts/searchProductContext';
import ShoppingCartProvider from '@/contexts/shoppingCartContext';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          <SearchProvider>
            <ShoppingCartProvider>
              <ToastAlert />
              <Component {...pageProps} />
            </ShoppingCartProvider>
          </SearchProvider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider >
  )
}
