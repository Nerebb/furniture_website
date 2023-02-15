import React from 'react'
import Container from './Container'
import Footer from './Footer'
import Header from './Header'


const BaseLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Container>
      <Header />
      {children}
      <section className='flex-grow'></section>
      <Footer />
    </Container>
  )
}

export default BaseLayout