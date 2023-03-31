import Button from '@/components/Button';
import Chip from '@/components/Chip';
import Loading from '@/components/static/Loading';
import ProductComment from '@/components/static/ProductDetail/ProductComment';
import ProductImages from '@/components/static/ProductDetail/ProductImages';
import ProductSimilar from '@/components/static/ProductDetail/ProductSimilar';
import { StarRating } from '@/components/static/StarRating';
import SwiperContainer from '@/components/Swiper/SwiperContainer';
import BaseLayout from '@/layouts/BaseLayout';
import Section from '@/layouts/Section';
import axios from '@/libs/axiosApi';
import { fCurrency } from '@/libs/utils/numberal';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetColorName } from 'hex-color-to-color-name';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
}

export default function ProductDetailPage({ }: Props) {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string>()
    const [selectedQty, setSelectedQty] = useState<number>(1)
    const [isWishlist, setIsWishlist] = useState<boolean>()
    const [error, setError] = useState<string>()

    const { productId } = router.query;
    const queryClient = useQueryClient()

    const { mutate, error: mutateError } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: ({ color, quantities }: { color: string, quantities?: number }) => axios.addToShoppingCart(productId as string, color, quantities),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })

    if (mutateError) console.log("mutateError", mutateError)

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['ProductDetail', productId],
        queryFn: () => axios.getProductById(productId as string),
        enabled: Boolean(productId),
    })

    const sameCateProducts = useQuery({
        queryKey: ['sameCateProducts', productId],
        queryFn: () => axios.getProducts({ limit: 10, cateId: product?.cateIds?.map(i => i.id) }),
        enabled: Boolean(product),
    })

    const sameRoomProducts = useQuery({
        queryKey: ['sameRoomProducts', productId],
        queryFn: () => axios.getProducts({ limit: 10, roomId: product?.roomIds?.map(i => i.id) }),
        enabled: Boolean(product),
    })

    //Controlling DisplayedData on client
    const MayLikesProduct = useMemo(() =>
        sameCateProducts?.data?.filter(i => i.id !== productId) || []
        , [sameCateProducts, productId])

    const RelatedProduct = useMemo(() =>
        sameRoomProducts?.data?.filter(i => i.id !== productId) || []
        , [sameRoomProducts, productId])

    if (isError) toast.error("Something went wrong!, please refesh the page")

    function handleAddToCart() {
        if (!selectedColor) return setError("Please select provided color")
        if (!selectedQty || selectedQty < 0) return setError("Quantities is missing")
        if (product?.available && selectedQty > product?.available) return setError("Product stock not meet requirements")

        mutate({ color: selectedColor, quantities: selectedQty }, {
            onError: (error: any) => {
                toast.error(error)
            },
            onSuccess: (res) => {
                toast.success(res.message)

                //Reset
                setSelectedQty(0)
                setError(undefined)
                setSelectedColor(undefined)
            }
        })
    }

    async function handleAddToWishList(productId?: string) {
        if (!productId) return
        queryClient.fetchQuery(['AddToWishList', productId], () => axios.addToWishList(productId))
    }

    return (
        <BaseLayout whiteSpace={false}>
            {isLoading &&
                <div className='flex-grow flex-center'>
                    <Loading />
                </div>
            }
            {product &&
                <article className='flex border-b'>
                    {/* Images */}
                    <aside className='w-1/2 flex flex-col py-5 pr-5'>
                        <ProductImages images={product.image} />
                        {MayLikesProduct && MayLikesProduct.length > 0 && <ProductSimilar products={MayLikesProduct} isLoading={sameCateProducts.isLoading} />}
                    </aside>

                    {/*Product detail*/}
                    <aside className='flex flex-col w-1/2 pl-5 py-5 border-l space-y-8'>
                        <div className='flex items-center justify-between'>
                            <h1 className="text-[32px] font-bold first-letter:capitalize">{product.name}</h1>
                            <button onClick={() => handleAddToWishList(productId as string)}>
                                <HeartIconOutline className='w-12 h-12 text-priBlack-50 hover:text-priBlue-300' />
                                <HeartIconSolid className='w-12 h-12 text-priBlue-300 hover:text-priBlack-50' />
                            </button>
                        </div>

                        {/* Description */}
                        <p className=''> {product.description}</p>

                        {/* Price */}
                        <div className="font-bold text-2xl flex justify-between items-center">
                            <span>{product.price ? fCurrency(product.price) : "Updating price"}</span>
                            <span className='font-semibold text-xl'>OnStock: {product.available}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex mb-7">
                            <div className="flex mr-3">
                                <StarRating ProductRating={product.avgRating} />
                            </div>
                            <span className='underline'>{product.ratedUsers} reviews</span>
                        </div>


                        {product?.colors &&
                            <div className="">
                                {product?.colors.map(color => (
                                    <Fragment key={color}>
                                        <Chip
                                            label={GetColorName(color)}
                                            modify="text-base px-4 py-1 mr-4"
                                            color={color}
                                            onClick={() => { setSelectedColor(color) }}
                                            selected={color === selectedColor}
                                        />
                                    </Fragment>
                                ))}
                            </div>}

                        <label
                            htmlFor={'quantities'}
                        >
                            Quantity:
                            <input
                                value={selectedQty}
                                className='rounded-md ml-2 border-none ring-none focus:ring-priBlue-500'
                                type='number'
                                inputMode="numeric"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedQty(parseInt(e.target.value))}
                            />
                        </label>

                        <div className="flex space-x-5">
                            <Button text='Buy now' variant='outline' modifier='w-[150px] py-1.5 font-semibold' />
                            <Button text='Add to cart' variant='fill' modifier='w-[150px] py-1.5 font-semibold' onClick={handleAddToCart} />
                        </div>

                        {error &&
                            <div className='text-red-500 first-letter:capitalize font-semibold'>{error}</div>
                        }

                        <div className='space-y-3'>
                            {product.totalComments >= 0 && (
                                <>
                                    <ProductComment content={false} />
                                    <ProductComment content={false} />
                                </>
                            )}
                        </div>
                    </aside>
                </article>
            }

            {/* ProductReview */}
            <Section title='Product reviews'>
                <div className='space-y-5 border-b border-priBlack-200/50 pb-5'>
                    <ProductComment />
                    <ProductComment />
                    <ProductComment />
                    <ProductComment />
                    <ProductComment />
                    <div className='w-full flex-center'>
                        <Button text='Load more' glowModify='noAnimation' />
                    </div>
                </div>
            </Section>


            {/* OtherProducts */}
            {RelatedProduct &&
                <Section title='Related products'>
                    <SwiperContainer type="ProductSquare" data={RelatedProduct} navigation={true} />
                </Section>
            }
        </BaseLayout>
    )
}