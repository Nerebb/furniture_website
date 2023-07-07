import { useWishlistContext } from '@/contexts/wishListContext';
import { fCurrency } from '@/libs/utils/numberal';
import { ProductCard } from '@/pages/api/products';
import { ProductDetail } from '@/pages/api/products/[productId]';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession()
  const { userWishlist, addToWishList, removeFromWishlist } = useWishlistContext()



  function handleAddWishList(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.preventDefault()
    addToWishList(product.id)
  }

  function handleRemoveFromWishlist(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.preventDefault()
    removeFromWishlist(product.id)
  }

  const Default =
    <Link
      href={`/products/${product.id}`}
      className='relative flex flex-col justify-between items-center rounded-xl md:rounded-3xl border'
    >
      {session ? (
        userWishlist && userWishlist.some(i => i.id === product.id) ? (
          <HeartIconSolid
            className='absolute w-8 h-8 text-priBlue-500 group-hover/wishlist:text-gray-500 z-40 right-3 top-3'
            onClick={handleRemoveFromWishlist}
          />
        ) : (
          <HeartIconOutline
            className='absolute w-8 h-8 text-gray-500 group-hover/wishlist:text-priBlue-500 z-40 right-3 top-3'
            onClick={handleAddWishList}

          />
        )
      ) : (<></>)}
      <div className='relative w-full h-full aspect-3/4'>
        {product.imageUrl ? (
          <Image
            className='rounded-xl md:rounded-3xl'
            alt=''
            src={product.imageUrl[0]}
            sizes="(max-width:1000px): 100vw"
            fill
            priority={true}
          />
        ) : (
          <ImageLost />
        )}
      </div>
      <div className='w-full px-4 flex-col md:flex-col justify-between first-letter:capitalize absolute py-2 bottom-0 rounded-b-3xl bg-priBlack-200/20 backdrop-blur-sm'>
        <h1 className='first-letter:capitalize'>{product.name}</h1>
        <div className='text-priBlue-600'>{fCurrency(product.price as number)}</div>
      </div>
    </Link>

  const ProductSquare =
    <Link href={`/products/${product.id}`} className='relative'>
      {session ? (
        userWishlist && userWishlist.some(i => i.id === product.id) ? (
          <HeartIconSolid
            className='absolute w-8 h-8 text-priBlue-500 group-hover/wishlist:text-gray-500 z-40 right-3 top-3'
            onClick={handleRemoveFromWishlist}
          />
        ) : (
          <HeartIconOutline
            className='absolute w-8 h-8 text-gray-500 group-hover/wishlist:text-priBlue-500 z-40 right-3 top-3'
            onClick={handleAddWishList}
          />
        )
      ) : (<></>)}
      <div className="w-full aspect-square relative mb-2 border">
        {product.imageUrl ? (
          <Image
            className=''
            alt=''
            src={product.imageUrl[0]}
            sizes="(max-width:1000px): 100vw"
            fill
            priority={true}
          />
        ) : (
          <ImageLost />
        )}
      </div>
      <div className="w-full flex-center whitespace-nowrap">
        <p className='capitalize dark:text-white'>{product.name}</p>
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