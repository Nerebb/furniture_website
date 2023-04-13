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
import { Fragment, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
}

export default function ProductDetailPage({ }: Props) {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string>()
    const [selectedQty, setSelectedQty] = useState<string | number>(1)
    const [isWishlist, setIsWishlist] = useState<boolean>()
    const [error, setError] = useState<string>()

    const { productId } = router.query;
    const queryClient = useQueryClient()

    const userWishist = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList()
    })

    useEffect(() => {
        if (!userWishist.data) return setIsWishlist(false)
        if (userWishist.data.some(i => i.id === productId)) return setIsWishlist(true)
    }, [userWishist.data, productId])

    const { mutate: mutateAddToWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.addToWishList(productId),
        onSuccess: (data) => {
            toast.success(data.message)
            setIsWishlist(true)
        }
    })

    const { mutate: mutateRemoveFromWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.deleteWishlistProduct(productId),
        onError: (error: any) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.info(data.message)
            setIsWishlist(false)
        }
    })

    const { mutate: mutateShoppingCart, isLoading: isLoadingShoppingCart } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: ({ color, quantities }: { color: string, quantities?: number }) => axios.addToShoppingCart(productId as string, color, quantities),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })

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

    function handleQtyOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedQty(e.target.value)
    }

    function handleAddToCart() {
        setError("")
        const curQty = typeof selectedQty !== 'number' ? parseInt(selectedQty) : selectedQty
        if (!selectedColor) return setError("Please select provided color")
        if (!curQty || curQty < 0) return setError("Quantities is missing")
        if (product?.available && selectedQty > product?.available) return setError("Product stock not meet requirements")

        mutateShoppingCart({ color: selectedColor, quantities: curQty }, {
            onError: (error: any) => {
                toast.error(error)
            },
            onSuccess: (res) => {
                toast.success(res.message)

                //Reset
                setSelectedQty(1)
                setError(undefined)
                setSelectedColor(undefined)
            }
        })
    }

    async function updateUserWishlist() {
        if (!productId || typeof productId !== 'string') return toast.error("Invalid Product")
        if (!isWishlist) return mutateAddToWishlist(productId)
        if (isWishlist) return mutateRemoveFromWishlist(productId)
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
                            <button onClick={updateUserWishlist}>
                                {isWishlist ? (
                                    <HeartIconSolid className='w-12 h-12 text-priBlue-300 hover:text-priBlack-50' />
                                ) : (
                                    <HeartIconOutline className='w-12 h-12 text-priBlack-50 hover:text-priBlue-300' />
                                )}
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQtyOnChange(e)}
                            />
                        </label>

                        <div className="flex space-x-5">
                            <Button text='Buy now' variant='outline' modifier='w-[150px] py-1.5 font-semibold' />
                            <Button
                                text={isLoadingShoppingCart ? "" : 'Add to cart'}
                                variant='fill'
                                modifier='w-[150px] py-1.5 font-semibold'
                                onClick={handleAddToCart}
                            >
                                {isLoadingShoppingCart &&
                                    <div className='flex-center w-full'>
                                        <Loading className='w-6 h-6' />
                                    </div>
                                }
                            </Button>
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