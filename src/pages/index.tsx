import Banner from '@/components/static/Banner'
import DailyDiscover from '@/components/static/DailyDiscover'
import FeatureProduct from '@/components/static/FeatureProduct'
import TopCategory from '@/components/static/TopCategory'
import BaseLayout from '@/layouts/BaseLayout'
import { Inter } from '@next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Nereb furniture hompage</title>
        <meta name="description" content="A NextJs demo furniture website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Banner />
        <TopCategory />
        {/* <FeatureProduct />
        <DailyDiscover /> */}
      </BaseLayout>
    </>
  )
}
