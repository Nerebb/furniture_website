import Head from 'next/head'
import React, { Fragment } from 'react'
import Container from './Container'
import Footer from './Footer'
import Header from './Header'

type Props = {
    tabTitle: string,
    tabDescription?: string,
    sideMenu: React.ReactNode
    children?: React.ReactNode
}

const SideMenuLayout = ({ tabTitle, tabDescription, sideMenu, children }: Props) => {

    return (
        <Fragment>
            <Head>
                <title>{tabTitle}</title>
                <meta name="description" content={tabDescription || 'Nereb furnitureApp'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container >
                <Header />
                <section className='flex-grow flex '>
                    <article className='min-w-[420px] py-5 pr-5 border-r border-priBlack-100'>
                        {sideMenu}
                    </article>
                    <article className='flex-grow p-5'>
                        {children}
                    </article>
                </section>
                <Footer />
            </Container>
        </Fragment>
    )
}

export default SideMenuLayout