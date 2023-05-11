import Card from '@/components/Card'
import SwiperContainer from '@/components/Swiper/SwiperContainer'
import { ProductCard } from '@/pages/api/products'
import Loading from '../Loading'
import useBrowserWidth from '@/hooks/useBrowserWidth'

type Props = {
    products: ProductCard[]
    isLoading: boolean
}

export default function ProductSimilar({ products, isLoading }: Props) {
    const browserWidth = useBrowserWidth()
    return (
        <Card type='SearchCard'>
            <div className='font-semibold text-xl mb-3 border-b border-priBlack-200/50 dark:text-white'>Things you may like</div>
            <div className='min-w-full xl:px-2'>
                {isLoading &&
                    <div className='w-full flex-center'>
                        <Loading />
                    </div>
                }
                {products &&
                    <SwiperContainer
                        type='ProductSquare'
                        data={products}
                        navigation={true}
                        slidesPerView={browserWidth > 1024 ? 3 : 2}
                        loop={true}
                        spaceBetween={50}
                    />
                }
            </div>
        </Card>
    )
}