import Image from 'next/image';
import { type } from 'os';
import React from 'react'

interface SwiperItemsProps {
  type: string,
  imageUrl: string
  category: string
  onClick?: () => void,
}

const SwiperItems: React.FC<SwiperItemsProps> = ({
  type,
  imageUrl,
  category,
  onClick,

}) => {

  const Default =
    <div className='relative flex flex-col justify-between items-center aspect-3/4' onClick={onClick}>
      <Image className='' alt='' src={imageUrl} fill priority={true} />
      <div className='text-deskText1 font-semibold mt-2'>{category}</div>
    </div>

  const FeatureProduct =
    <div className='flex flex-col justify-between items-center max-w-[300px] h-auto flex-1 relative' onClick={onClick}>
      <div className='relative aspect-3/4'>
        <Image className='' alt='' src={imageUrl[0]} fill priority={true} />
      </div>
      {/* <div className='w-full text-xl font-semibold absolute bottom-0 p-2'>
        <div>
          <p>Minimalist Sofa</p>
          <p>500.000 VND</p>
        </div>
        <div className='w-full h-20'>
          <CreatorInfo CreatorAva={false} BtnBuy={false} />
        </div>
      </div> */}
    </div>

  switch (type) {
    case 'FeatureProduct':
      return FeatureProduct;
    default:
      return Default;
  }

}

export default SwiperItems