import Section from "@/layouts/Section"
import axios from "@/libs/axiosApi"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import SwiperContainer from "../Swiper/SwiperContainer"
import Loading from "./Loading"

const TopCategory = () => {
  const { data: products, isError, isLoading } = useQuery({
    queryKey: ['TopCategory'],
    queryFn: () => axios.getProducts({ limit: 16, rating: 2 })
  })

  if (isError) toast.error("Something went wrong! Please refresh the page for the best experience")

  return (
    <Section title='TopCategory'>
      {isLoading && (
        <div className="flex-center">
          <Loading />
        </div>
      )}
      {products &&
        <SwiperContainer type='Default' data={products} navigation={true} />
      }
    </Section>
  )
}

export default TopCategory