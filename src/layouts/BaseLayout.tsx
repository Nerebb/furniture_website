import React from 'react'
import Container from './Container'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'
import Head from 'next/head'

type Props = {
  tabTitle: string,
  tabDescription?: string,
  whiteSpace?: boolean
}

const BaseLayout = ({ tabTitle, tabDescription, whiteSpace = true, children }: React.PropsWithChildren<Props>) => {
  return (
    <Container>
      <Head>
        <title>{tabTitle}</title>
        <meta name="description" content={tabDescription || 'Nereb furnitureApp'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainHeader />
      {children}
      {whiteSpace && <section className='flex-grow'></section>}
      <MainFooter />
    </Container>
  )
}

export default BaseLayout