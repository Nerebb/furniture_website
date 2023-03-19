import Chip from '@/components/Chip'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductCard } from '@/pages/api/products'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import Button from '../../Button'
import Card from '../../Card'
import ImageLost from '../ImageLost'
import Loading from '../Loading'
import { StarRating } from '../StarRating'

type Props = {
    product?: ProductCard
    isLoading?: boolean
}

const status = [
    { id: 0, label: 'Order confirmed', msg: "User is processing your orders" },
    { id: 1, label: 'Order processing', msg: "User is processing your orders" },
    { id: 2, label: 'Shipping', msg: "User is shipping your orders" },
    { id: 3, label: 'Rating', msg: "Please rate and comment to improve our product and have a chance to have awesome gift from us" },
]


export default function WishListProduct({ product, isLoading = true }: Props) {

    return (
        <Card modify={classNames(
            'divide-y h-[300px]',
        )}>
            {isLoading &&
                <div className='h-full flex-center'>
                    <Loading />
                </div>
            }

            {product &&
                <>
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
                                <span className='font-semibold'>{product.name}</span>
                                <span className='text-gray-500'>
                                    {product.colors?.map(color => (
                                        <Chip key={color} color={color} label={GetColorName(color)} onClick={() => { }} />
                                    ))}
                                </span>
                            </dt>
                            <dd className='text-gray-500 space-x-5'>
                                <span className='text-priBlue-600 font-semibold'>{product.price ? fCurrency(product.price) : "OnUpdating...."}</span>
                                <span>Available: {product.available}</span>
                            </dd>

                            <dd className='text-gray-500 flex space-x-2'>
                                <StarRating ProductRating={product.rating} />
                                <p className='text-sm'>({product.ratedUsers})</p>
                            </dd>
                            <dd className='flex-grow text-gray-500 first-letter:capitalize overflow-hidden'>{product.description}</dd>
                            <dd className='flex-grow'></dd>
                            <dd className='flex space-x-5'>
                                <Button text='Buy now' modifier='py-1 px-8' />
                                <Button text='Remove' variant='outline' modifier='py-1 px-8' />
                            </dd>
                        </aside>
                    </dl>
                </>
            }
        </Card>
    )
}