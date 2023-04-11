import { fCurrency } from '@/libs/utils/numberal';
import { ProductCard } from '@/pages/api/products';
import { ProductDetail } from '@/pages/api/products/[productId]';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ImageLost from '../static/ImageLost';
import { SwiperContainerProps } from './SwiperContainer';

interface SwiperItemsProps {
  type: SwiperContainerProps['type'],
  product: ProductCard | ProductDetail
  onClick?: () => void,
}

const SwiperItems: React.FC<SwiperItemsProps> = ({
  type,
  product,
  onClick,
}) => {

  const Default =
    <Link href={`/products/${product.id}`} className='flex flex-col justify-between items-center rounded-3xl'>
      <div className='relative w-full h-full aspect-3/4 '>
        {product.imageUrl ? (
          <Image className='rounded-3xl' alt='' src={product.imageUrl[0]} fill priority={true} />
        ) : (
          <ImageLost />
        )}
      </div>
      <div className='w-full px-4 flex justify-between first-letter:capitalize absolute py-2 bottom-0 rounded-b-3xl bg-priBlack-200/20 backdrop-blur-sm'>
        <h1 className='first-letter:capitalize'>{product.name}</h1>
        <div className='text-priBlue-600'>{fCurrency(product.price as number)}</div>
      </div>
    </Link>

  const ProductSquare =
    <Link href={`/products/${product.id}`} className=''>
      <div className="w-full aspect-square relative mb-2">
        {product.imageUrl ? (
          <Image className='' alt='' src={product.imageUrl[0]} fill priority={true} />
        ) : (
          <ImageLost />
        )}
      </div>
      <div className="w-full flex-center whitespace-nowrap">
        <p className='capitalize text'>{product.name}</p>
      </div>
    </Link>

  switch (type) {
    case 'ProductSquare':
      return ProductSquare
    default:
      return Default; //Images only
  }

}

export default SwiperItems