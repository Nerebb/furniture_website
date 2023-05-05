import Section from "@/layouts/Section"
import axios from "@/libs/axiosApi"
import { useQuery } from "@tanstack/react-query"
import Card from "../Card"
import SwiperContainer from "../Swiper/SwiperContainer"
import Loading from "./Loading"
import useBrowserWidth from "@/hooks/useBrowserWidth"


const FeatureProduct = () => {
    const { data: FeatureProducts, isLoading, isError } = useQuery({
        queryKey: ['FeatureProducts'],
        queryFn: () => axios.getProducts({ isFeatureProduct: true }),
    })
    const browserWidth = useBrowserWidth()

    return (
        <Section type='CustomTitle'>
            <Card type="SearchCard">
                <div className='flex flex-col xl:flex-row justify-between p-5'>
                    <div className='product-descript w-[400px] p-5'>
                        <h1 className='text-[32px] font-bold mb-5 uppercase dark:text-white'>Our{'\''}s featured products</h1>
                        <p className='mb-5 dark:text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                    </div>
                    <div className='max-w-screen-full xl:w-[500px] grow'>
                        {isLoading && <div className="flex-center"><Loading /></div>}
                        {FeatureProducts &&
                            <SwiperContainer
                                data={FeatureProducts}
                                slidesPerView={browserWidth > 1024 ? 3 : 2}
                            />}
                    </div>
                </div>
            </Card>
        </Section>
    )
}

export default FeatureProduct