import Section from "@/layouts/Section"
import axios from "@/libs/axiosApi"
import { ProductCard } from "@/pages/api/products"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import Button from "../Button"
import Card from "../Card"
import SwiperContainer from "../Swiper/SwiperContainer"
import Loading from "./Loading"


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
    // const [product, setProduct] = useState<ProductCard>()
    const { data: FeatureProducts, isLoading, isError } = useQuery({
        queryKey: ['FeatureProducts'],
        queryFn: () => axios.getProducts({ isFeatureProduct: true }),
    })

    return (
        <Section type='CustomTitle'>
            <Card type="SearchCard">
                <div className='flex justify-between p-5'>
                    <div className='product-descript w-[400px] p-5'>
                        <h1 className='text-[32px] font-bold mb-5 uppercase'>Our{'\''}s featured products</h1>
                        <p className='mb-5'>{data.description}</p>
                        <Button text="Read more" />
                    </div>
                    <div className='max-w-laptop w-[500px] grow'>
                        {isLoading && <div className="flex-center"><Loading /></div>}
                        {FeatureProducts && <SwiperContainer data={FeatureProducts} slidesPerView={3} />}
                    </div>
                </div>
            </Card>
        </Section>
    )
}

export default FeatureProduct