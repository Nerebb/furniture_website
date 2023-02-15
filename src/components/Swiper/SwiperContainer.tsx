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

interface SwiperProps {
    data: any[],
    spaceBetween?: number;
    slidesPerView?: 'auto' | number;
    pagination?: boolean,
    navigation?: boolean,
    loop?: boolean,
    type:
    | 'Default'
    | 'FeatureProduct',
    onClick?: () => void,
}

const SwiperContainer: React.FC<SwiperProps> = ({
    type = 'Default',
    data,
    spaceBetween,
    slidesPerView,
    pagination,
    navigation,
    loop,
    onClick
}) => {
    return (
        <Swiper
            className="mySwiper"
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            spaceBetween={spaceBetween ? spaceBetween : 50}
            slidesPerView={slidesPerView ? slidesPerView : 4}
            pagination={pagination}
            navigation={navigation ? {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            } : undefined}
            loop={loop ? loop : true}

        >
            {data.map(item => (
                <SwiperSlide key={item.id}>
                    <SwiperItems type={type} category={item.category} imageUrl={item.imageUrl} onClick={onClick} />
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