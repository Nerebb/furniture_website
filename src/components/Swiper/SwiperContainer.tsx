// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';

// import required modules
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper';
import SwiperItems from './SwiperItems';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ProductCard } from '@/pages/api/products';
import { ProductDetail } from '@/pages/api/products/[productId]';
import { ReactNode } from 'react';

export interface SwiperContainerProps {
    data: ProductCard[] | ProductDetail[],
    spaceBetween?: number;
    slidesPerView?: 'auto' | number;
    pagination?: boolean,
    navigation?: boolean | ReactNode,
    loop?: boolean,
    type?:
    | 'Default'
    | 'ProductSquare',
    onClick?: () => void,
}

const SwiperContainer: React.FC<SwiperContainerProps> = ({
    type = 'Default',
    data,
    spaceBetween,
    slidesPerView,
    pagination,
    navigation,
    loop = true,
    onClick
}) => {
    const defaulNav = {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
    }

    const customNav = {
        prevEl: '.customNav-button-prev',
        nextEl: '.customNav-button-next'
    }

    return (
        <Swiper
            className="mySwiper"
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            spaceBetween={spaceBetween ? spaceBetween : 50}
            slidesPerView={slidesPerView ? slidesPerView : 4}
            pagination={pagination}
            navigation={navigation ? defaulNav : undefined}
            loop={loop}
        >
            {data.map(item => (
                <SwiperSlide key={item.id}>
                    <SwiperItems type={type} product={item} onClick={onClick} />
                </SwiperSlide>
            ))}
            {navigation &&
                <>
                    <div className="swiper-button-prev">
                        <ChevronLeftIcon className='w-6 h-6' />
                    </div>
                    <div className="swiper-button-next">
                        <ChevronRightIcon className='w-6 h-6' />
                    </div>
                </>}
        </Swiper>
    )
}

export default SwiperContainer