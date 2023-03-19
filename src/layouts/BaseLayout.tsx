import React from 'react'
import Container from './Container'
import Footer from './Footer'
import Header from './Header'

type Props = {
  whiteSpace?: boolean
}

const BaseLayout = ({ whiteSpace = true, children }: React.PropsWithChildren<Props>) => {
  return (
    <Container>
      <Header />
      {children}
      {whiteSpace && <section className='flex-grow'></section>}
      <Footer />
    </Container>
  )
}

export default BaseLayout