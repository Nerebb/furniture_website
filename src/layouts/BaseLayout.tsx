import React from 'react'
import Container from './Container'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'

type Props = {
  whiteSpace?: boolean
}

const BaseLayout = ({ whiteSpace = true, children }: React.PropsWithChildren<Props>) => {
  return (
    <Container>
      <MainHeader />
      {children}
      {whiteSpace && <section className='flex-grow'></section>}
      <MainFooter />
    </Container>
  )
}

export default BaseLayout