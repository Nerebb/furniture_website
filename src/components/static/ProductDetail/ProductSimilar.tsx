import Card from '@/components/Card'
import SwiperContainer from '@/components/Swiper/SwiperContainer'
import { ProductCard } from '@/pages/api/products'
import Loading from '../Loading'

type Props = {
    products: ProductCard[]
    isLoading: boolean
}

export default function ProductSimilar({ products, isLoading }: Props) {
    return (
        <Card type='SearchCard'>
            <div className='font-semibold text-xl mb-3 border-b border-priBlack-200/50 dark:text-white'>Things you may like</div>
            <div className='min-w-full px-2'>
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
                        slidesPerView={3}
                        loop={true}
                        spaceBetween={50}
                    />
                }
            </div>
        </Card>
    )
}