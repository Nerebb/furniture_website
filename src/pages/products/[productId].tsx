import Button from '@/components/Button';
import Chip from '@/components/Chip';
import Loading from '@/components/static/Loading';
import ProductComment from '@/components/static/ProductDetail/ProductComment';
import ProductImages from '@/components/static/ProductDetail/ProductImages';
import ProductReview from '@/components/static/ProductDetail/ProductReview';
import ProductSimilar from '@/components/static/ProductDetail/ProductSimilar';
import { StarRating } from '@/components/static/StarRating';
import SwiperContainer from '@/components/Swiper/SwiperContainer';
import BaseLayout from '@/layouts/BaseLayout';
import Section from '@/layouts/Section';
import axios from '@/libs/axiosApi';
import { fCurrency } from '@/libs/utils/numberal';
import { Transition } from '@headlessui/react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetColorName } from 'hex-color-to-color-name';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useReducer, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
}

export default function ProductDetailPage({ }: Props) {
    const { data: session } = useSession()
    const router = useRouter();
    const productId = router.query.productId as string;
    const [error, setError] = useState<string>()
    const queryClient = useQueryClient()

    //AddToCart
    const [selectedColor, setSelectedColor] = useState<string>()
    const [selectedQty, setSelectedQty] = useState<string | number>(1)

    //NewCmt
    const [createCmt, setCreateCmt] = useState<boolean>(false)

    //AddToWishlist
    const [isWishlist, setIsWishlist] = useState<boolean>(false)

    //FetchProductReview
    const [loadReview, setLoadReview] = useState<boolean>(false)

    const userWishist = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList(),
        enabled: !!session?.id
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
        },
        onError: (data: any) => {
            toast.error(data)
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
        queryKey: ['SameCateProducts', productId],
        queryFn: () => axios.getProducts({ limit: 10, cateId: product?.cateIds }),
        enabled: Boolean(product),
    })

    const sameRoomProducts = useQuery({
        queryKey: ['SameRoomProducts', productId],
        queryFn: () => axios.getProducts({ limit: 10, roomId: product?.roomIds }),
        enabled: Boolean(product),
    })

    const topReviews = useQuery({
        queryKey: ['TopReviews', productId],
        queryFn: () => axios.getReviews({ productId, limit: 2 }),
        enabled: Boolean(productId),
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
        if (product?.available && curQty > product?.available) return setError("Product stock not meet requirements")

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
                        {MayLikesProduct && MayLikesProduct.length > 0 &&
                            <ProductSimilar products={MayLikesProduct} isLoading={sameCateProducts.isLoading} />
                        }
                    </aside>

                    {/*Product detail*/}
                    <aside className='flex flex-col w-1/2 pl-5 py-5 border-l space-y-8'>
                        <div className='flex items-center justify-between'>
                            <h1 className="text-[32px] font-bold first-letter:capitalize dark:text-white">{product.name}</h1>
                            <div onClick={updateUserWishlist}>
                                {isWishlist ? (
                                    <HeartIconSolid className='w-12 h-12 text-priBlue-300 hover:text-priBlack-50' />
                                ) : (
                                    <HeartIconOutline className='w-12 h-12 text-priBlack-50 hover:text-priBlue-300' />
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className='dark:text-white'> {product.description}</p>

                        {/* Price */}
                        <div className="font-bold text-2xl flex justify-between items-center dark:text-white">
                            <span>{product.price ? fCurrency(product.price) : "Updating price"}</span>
                            <span className='font-semibold text-xl'>OnStock: {product.available}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex mb-7 dark:text-white">
                            <div className="flex mr-3">
                                <StarRating ProductRating={product.avgRating} />
                            </div>
                            <span className='underline'>{product.totalRating} reviews</span>
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

                        <div>
                            <label
                                htmlFor='quantities'
                                className='dark:text-white'
                            >
                                Quantity:
                                <input
                                    value={selectedQty}
                                    className='rounded-md max-w-[80px] ml-2 border-none ring-none hover:ring-1 hover:ring-priBlue-500 focus:ring-priBlue-500 dark:bg-priBlack-400'
                                    type='number'
                                    min={1}
                                    inputMode="numeric"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQtyOnChange(e)}
                                />
                            </label>
                            {error &&
                                <span className='text-red-500 first-letter:capitalize font-semibold ml-2'>{error}</span>
                            }
                        </div>

                        <div className="flex space-x-5">
                            {/* <Button
                                text='Buy now'
                                variant='outline'
                                modifier='w-[150px] py-1.5 font-semibold'
                            /> */}
                            <Button
                                text={isLoadingShoppingCart ? "" : 'Add to cart'}
                                variant='fill'
                                modifier='w-[150px] py-1.5 font-semibold dark:text-white'
                                onClick={handleAddToCart}
                            >
                                {isLoadingShoppingCart &&
                                    <div className='flex-center w-full'>
                                        <Loading className='w-6 h-6 fill-priBlue-500' />
                                    </div>
                                }
                            </Button>
                            <Button
                                text={createCmt ? "Close" : "Add review"}
                                variant='outline'
                                modifier='w-[150px] py-1.5 font-semibold dark:text-white'
                                onClick={() => setCreateCmt(prev => !prev)}
                            />
                        </div>

                        <Transition
                            show={createCmt}
                            as='div'
                            className='space-y-3'
                            enter="transition-all duration-700"
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                        >
                            <ProductComment productId={productId} newReview={true} />
                        </Transition>

                        <Transition
                            show={!createCmt}
                            as='div'
                            className='space-y-3'
                            enter="transition-all duration-700"
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                        >
                            {topReviews.data && topReviews.data.map(review => (
                                <button
                                    key={`top-${review.id}`}
                                    onClick={() => setLoadReview(true)}
                                    className='w-full'
                                >
                                    <ProductComment productId={productId} viewContent={false} review={review} />
                                </button>
                            ))}
                        </Transition>
                    </aside>
                </article>
            }

            {/* ProductReview */}
            <Transition
                show={loadReview}
                enter="transition-all duration-700"
                enterFrom='opacity-0 translate-y-5 h-0'
                enterTo='opacity-100 translate-y-0 h-full'
            >
                <ProductReview productId={productId} loadReview={loadReview} />
            </Transition>


            {/* OtherProducts */}
            {RelatedProduct &&
                <Section title='Related products'>
                    <SwiperContainer type="ProductSquare" data={RelatedProduct} navigation={true} />
                </Section>
            }
        </BaseLayout>
    )
}