import Section from "@/layouts/Section"
import axios from "@/libs/axiosApi"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import SwiperContainer from "../Swiper/SwiperContainer"
import Loading from "./Loading"
import useBrowserWidth from "@/hooks/useBrowserWidth"

const TopCategory = () => {
  const { data: products, isError, isLoading } = useQuery({
    queryKey: ['TopCategory'],
    queryFn: () => axios.getProducts({ limit: 16, rating: 2 })
  })
  const browserWidth = useBrowserWidth()
  if (isError) toast.error("Something went wrong! Please refresh the page for the best experience")

  return (
    <Section title='TopCategory'>
      {isLoading && (
        <div className="flex-center">
          <Loading />
        </div>
      )}
      {products && products.length > 0 &&
        <SwiperContainer
          type='Default'
          data={products}
          navigation={true}
          slidesPerView={browserWidth > 1028 ? 4 : browserWidth > 768 ? 3 : browserWidth > 450 ? 2 : 1}
        />
      }
    </Section>
  )
}

export default TopCategory