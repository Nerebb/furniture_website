import Head from 'next/head'
import React, { Fragment } from 'react'
import Container from './Container'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import Modal from '@/components/Modal'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ProductSideMenu from '@/components/static/ProductSideMenu'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'

type Props = {
    tabTitle: string,
    tabDescription?: string,
    sideMenu: React.ReactNode
    children?: React.ReactNode
}

const SideMenuLayout = ({ tabTitle, tabDescription, sideMenu, children }: Props) => {
    const browserWidth = useBrowserWidth()
    const router = useRouter()
    return (
        <Fragment>
            <Head>
                <title>{tabTitle}</title>
                <meta name="description" content={tabDescription || 'Nereb furnitureApp'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container >
                <MainHeader />
                <section className='flex-grow flex '>
                    {browserWidth > 400 || (router.pathname === '/account/[[...account]]' && browserWidth > 1200) ?
                        (
                            <article className='max-w-[420px] py-5 sm:pr-5 sm:border-r border-priBlack-100'>
                                {sideMenu}
                            </article>
                        ) : (
                            <></>
                        )}
                    <article className='flex-grow p-2 md:p-5'>
                        {children}
                    </article>
                </section>
                <MainFooter />
            </Container>
        </Fragment>
    )
}

export default SideMenuLayout