import Banner from '@/components/static/Banner'
import DailyDiscover from '@/components/static/DailyDiscover'
import FeatureProduct from '@/components/static/FeatureProduct'
import TopCategory from '@/components/static/TopCategory'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import BaseLayout from '@/layouts/BaseLayout'

export default function Home() {
  const browserWidth = useBrowserWidth()

  return (
    <BaseLayout tabTitle='Nereb furniture homepage'>
      {browserWidth > 500 && <Banner />}
      <TopCategory />
      {browserWidth > 500 && <FeatureProduct />}
      <DailyDiscover />
    </BaseLayout>
  )
}
