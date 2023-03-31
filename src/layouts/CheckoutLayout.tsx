import Head from 'next/head'
import React, { Fragment } from 'react'
import CheckoutHeader from './CheckoutHeader'
import Container from './Container'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'

type Props = {
    tabTitle: string,
    tabDescription?: string,
    rightSide: React.ReactNode
    leftSide?: React.ReactNode
}

export function CheckoutLayout({ tabTitle, tabDescription, rightSide, leftSide }: Props) {

    return (
        <Fragment>
            <Head>
                <title>{tabTitle}</title>
                <meta name="description" content={tabDescription || 'Nereb furnitureApp'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container >
                <CheckoutHeader />
                <div className='grid grid-cols-2'>
                    <div >{leftSide}</div>
                    <div >{rightSide}</div>
                </div>
                <div className='grow'></div>
                <MainFooter />
            </Container>
        </Fragment>
    )
}
