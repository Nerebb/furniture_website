import Head from 'next/head'
import React, { Fragment, ReactNode } from 'react'
import CheckoutHeader from './CheckoutHeader'
import Container from './Container'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'
import CheckoutProvider from '@/contexts/checkoutContext'

type Props = {
    tabTitle: string,
    tabDescription?: string,
    children?: ReactNode
}

export function CheckoutLayout({ tabTitle, tabDescription, children }: Props) {

    return (
        <CheckoutProvider>
            <Head>
                <title>{tabTitle}</title>
                <meta name="description" content={tabDescription || 'Nereb furnitureApp'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container height='100vh'>
                <CheckoutHeader />
                {children}
                <MainFooter />
            </Container>
        </CheckoutProvider>
    )
}
