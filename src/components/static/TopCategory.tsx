import Section from "@/layouts/Section"
import SwiperContainer from "../Swiper/SwiperContainer"


const data = [
  { id: 0, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 1, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 2, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 3, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 4, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 5, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 6, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
  { id: 7, imageUrl: '/images/OliverSofa_RS.jpg', category: 'Living room' },
]


const TopCategory = () => {
  return (
    <Section title='TopCategory'>
      <SwiperContainer type='Default' data={data} navigation={true} />
    </Section>
  )
}

export default TopCategory