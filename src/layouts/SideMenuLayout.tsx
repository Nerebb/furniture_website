import SideMenu from '@/components/SideMenu'
import React, { useContext } from 'react'
import Container from './Container'
import Footer from './Footer'
import Header from './Header'

type Props = {
    sideMenuType?: 'string'
    children?: React.ReactNode
}

const SideMenuLayout = ({ sideMenuType, children }: Props) => {

    return (
        <Container >
            <Header />
            <section className='flex-grow flex '>
                <article className='min-w-[420px] pt-5 pr-5 border-r border-priBlack-100'>
                    <SideMenu />
                </article>
                <article className='flex-grow p-5'>
                    {children}
                </article>
            </section>
            <Footer />
        </Container>
    )
}

export default SideMenuLayout