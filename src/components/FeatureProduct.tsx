import React from 'react'
import Section from '../layouts/Section'
import { GetServerSideProps } from 'next'
import Button from './Button'
import SwiperContainer from './Swiper/SwiperContainer'

const FeatureProduct = () => {
    const data = {
        id: "bruh",
        label: "Minimalist",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        product: [
            {
                id: "lord",
                name: "Minimalist Sofa",
                descript_short: "Lorem ipsum dolor sit amet",
                price: 500.000,
                imageUrl: ['/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg']
            },
            {
                id: "lord1",
                name: "Minimalist Sofa",
                descript_short: "Lorem ipsum dolor sit amet",
                price: 500.000,
                imageUrl: ['/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg']
            },
            {
                id: "lord2",
                name: "Minimalist Sofa",
                descript_short: "Lorem ipsum dolor sit amet",
                price: 500.000,
                imageUrl: ['/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg']
            },
            {
                id: "lord3",
                name: "Minimalist Sofa",
                descript_short: "Lorem ipsum dolor sit amet",
                price: 500.000,
                imageUrl: ['/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg', '/images/OliverSofa_RS.jpg']
            },
        ]
    }
    return (
        <Section type='CustomTitle'>
            <div className='flex justify-between'>
                <div className='product-descript w-[400px] p-10'>
                    <h1 className='text-[32px] font-bold mb-5'>{data.label}</h1>
                    <p className='mb-5'>{data.description}</p>
                    <Button text="Read more" />
                </div>
                <div className='max-w-laptop w-[500px] grow h-[500px]'>
                    <SwiperContainer type='FeatureProduct' data={data.product} slidesPerView={3} />
                </div>
            </div>
        </Section>
    )
}

export default FeatureProduct