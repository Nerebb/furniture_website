import Chip from '@/components/Chip'
import { useWishlistContext } from '@/contexts/wishListContext'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductCard } from '@/pages/api/products'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from '../../Button'
import Card from '../../Card'
import ImageLost from '../ImageLost'
import Loading from '../Loading'
import { StarRating } from '../StarRating'

type Props = {
    product?: ProductCard
    isLoading?: boolean
}

export default function WishListProduct({ product, isLoading = true }: Props) {
    const router = useRouter()
    const { removeFromWishlist } = useWishlistContext()

    return (
        <Card modify={classNames(
            'divide-y h-[300px] bg-white dark:bg-priBlack-600',
        )}>
            {isLoading &&
                <div className='h-full flex-center'>
                    <Loading />
                </div>
            }

            {product &&
                <dl className={classNames(
                    'flex space-x-5 p-5 h-full',
                )}>
                    {/* Images */}
                    <dt className='relative aspect-square rounded-xl'>
                        {product.imageUrl && product.imageUrl?.length > 0 ? (
                            <Image fill alt='' className='rounded-xl' src={product.imageUrl[0]} />
                        ) : (
                            <ImageLost />
                        )}
                    </dt>

                    {/* Product */}
                    <aside className='grow-3 flex flex-col space-y-3'>
                        <dt className='first-letter:capitalize space-x-2'>
                            <span className='font-semibold dark:text-white'>{product.name}</span>
                            <span className='text-gray-500 dark:text-white'>
                                {product.colors?.map(color => (
                                    <Chip key={color} color={color} label={GetColorName(color)} onClick={() => { }} />
                                ))}
                            </span>
                        </dt>
                        <dd className='text-gray-500 space-x-5 dark:text-white'>
                            <span className='text-priBlue-600 font-semibold dark:text-white'>{product.price ? fCurrency(product.price) : "OnUpdating...."}</span>
                            <span>Available: {product.available}</span>
                        </dd>

                        <dd className='text-gray-500 flex space-x-2 dark:text-white'>
                            <StarRating ProductRating={product.avgRating} />
                            <p className='text-sm'>({product.totalRating})</p>
                        </dd>
                        <dd className='flex-grow text-gray-500 first-letter:capitalize overflow-hidden dark:text-gray-300'>{product.description}</dd>
                        <dd className='flex-grow'></dd>
                        <dd className='flex space-x-5'>
                            <Button
                                text='Product detail'
                                modifier='py-1 w-36 dark:text-white'
                                onClick={() => router.push(`/products/${product.id}`)}
                            />
                            <Button
                                text='Remove'
                                variant='outline'
                                modifier='py-1 w-36 dark:text-white border-red-500 hover:text-red-500'
                                glowEffect={false}
                                onClick={() => removeFromWishlist(product.id)}
                            />
                        </dd>
                    </aside>
                </dl>
            }
        </Card>
    )
}