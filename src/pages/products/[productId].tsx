import Button from '@/components/Button';
import Chip from '@/components/Chip';
import Loading from '@/components/static/Loading';
import ProductComment from '@/components/static/ProductDetail/ProductComment';
import ProductImages from '@/components/static/ProductDetail/ProductImages';
import ProductReview from '@/components/static/ProductDetail/ProductReview';
import ProductSimilar from '@/components/static/ProductDetail/ProductSimilar';
import { StarRating } from '@/components/static/StarRating';
import SwiperContainer from '@/components/Swiper/SwiperContainer';
import useBrowserWidth from '@/hooks/useBrowserWidth';
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

type ProductReducer = {
    selectedColor: string
    selectedQty: number
    createCmt: boolean
    isWishlist: boolean
    loadReview: boolean
    error: string,
}



const initProductState = {
    error: "",
    selectedColor: '',
    selectedQty: 0,
    createCmt: false,
    isWishlist: false,
    loadReview: false,
} satisfies ProductReducer

export default function ProductDetailPage() {
    const { data: session } = useSession()
    const router = useRouter();
    const productId = router.query.productId as string;
    const queryClient = useQueryClient()
    const browserWidth = useBrowserWidth()

    const [productState, setProductState] = useReducer(
        (prev: ProductReducer, next: Partial<ProductReducer>) => ({ ...prev, ...next }),
        initProductState
    )

    // const [error, setError] = useState<string>()
    // //AddToCart
    // const [selectedColor, setSelectedColor] = useState<string>()
    // const [selectedQty, setSelectedQty] = useState<string | number>(1)

    // //NewCmt
    // const [createCmt, setCreateCmt] = useState<boolean>(false)

    // //AddToWishlist

    // //FetchProductReview
    // const [loadReview, setLoadReview] = useState<boolean>(false)

    const userWishist = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList(),
        enabled: !!session?.id,
        onSuccess: (data) => {
            if (data.some(i => i.id === productId)) return setProductState({ isWishlist: true })
        }
    })

    const { mutate: mutateAddToWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.addToWishList(productId),
        onSuccess: (data) => {
            toast.success(data.message)
            setProductState({ isWishlist: true })
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
            setProductState({ isWishlist: false })
        }
    })

    const { mutate: mutateShoppingCart, isLoading: isLoadingShoppingCart } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: ({ color, quantities }: { color: string, quantities?: number }) => axios.addToShoppingCart(productId as string, color, quantities),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })

    const { data: isOrdered } = useQuery({
        queryKey: ['isOrdered', productId],
        queryFn: () => axios.checkIsOrdered(productId),
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
        setProductState({ selectedQty: Number(e.target.value) })
    }


    function handleAddToCart() {
        setProductState({ error: '' })
        if (!session) return router.push('/login')
        const curQty = productState.selectedQty
        if (!productState.selectedColor) return setProductState({ error: "Please select provided color" })
        if (!productState.selectedQty || productState.selectedQty < 0) return setProductState({ error: "Quantities is missing" })
        if (product?.available && curQty > product?.available) return setProductState({ error: "Product stock not meet requirements" })

        mutateShoppingCart({ color: productState.selectedColor, quantities: productState.selectedQty }, {
            onError: (error: any) => {
                toast.error(error)
            },
            onSuccess: (res) => {
                toast.success(res.message)

                //Reset
                setProductState({ selectedColor: '', selectedQty: 0, error: "" })
            }
        })
    }

    async function updateUserWishlist() {
        if (!session) return router.push('/login')
        if (!productId || typeof productId !== 'string') return toast.error("Invalid Product")
        if (!productState.isWishlist) return mutateAddToWishlist(productId)
        if (productState.isWishlist) return mutateRemoveFromWishlist(productId)
    }

    return (
        <BaseLayout
            tabTitle={product?.name || "Product detail"}
            whiteSpace={false}
        >
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
                                {productState.isWishlist ? (
                                    <HeartIconSolid className='w-10 h-10 xl:w-12 xl:h-12 text-priBlue-300 hover:text-priBlack-50' />
                                ) : (
                                    <HeartIconOutline className='w-10 h-10 xl:w-12 xl:h-12 text-priBlack-50 hover:text-priBlue-300' />
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
                                            onClick={() => { setProductState({ selectedColor: color }) }}
                                            selected={color === productState.selectedColor}
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
                                    value={productState.selectedQty}
                                    className='rounded-md max-w-[80px] ml-2 border-none ring-none hover:ring-1 hover:ring-priBlue-500 focus:ring-priBlue-500 dark:bg-priBlack-400'
                                    type='number'
                                    min={1}
                                    inputMode="numeric"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQtyOnChange(e)}
                                />
                            </label>
                            {productState.error &&
                                <span className='text-red-500 first-letter:capitalize font-semibold ml-2'>{productState.error}</span>
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
                            {isOrdered && <Button
                                text={productState.createCmt ? "Close" : "Add review"}
                                variant='outline'
                                modifier='w-[150px] py-1.5 font-semibold dark:text-white'
                                onClick={() => setProductState({ createCmt: !productState.createCmt })}
                            />}
                        </div>

                        <Transition
                            show={productState.createCmt}
                            as='div'
                            className='space-y-3'
                            enter="transition-all duration-700"
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                        >
                            <ProductComment productId={productId} newReview={true} />
                        </Transition>

                        {browserWidth > 1024 && (
                            <Transition
                                show={!productState.createCmt}
                                as='div'
                                className='space-y-3'
                                enter="transition-all duration-700"
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                {topReviews.data && topReviews.data.map(review => (
                                    <button
                                        key={`top-${review.id}`}
                                        onClick={() => setProductState({ loadReview: true })}
                                        className='w-full'
                                    >
                                        <ProductComment productId={productId} viewContent={false} review={review} />
                                    </button>
                                ))}
                            </Transition>
                        )}
                    </aside>
                </article>
            }

            {/* ProductReview */}
            <Transition
                show={productState.loadReview || browserWidth < 1025}
                enter="transition-all duration-700"
                enterFrom='opacity-0 translate-y-5 h-0'
                enterTo='opacity-100 translate-y-0 h-full'
            >
                <ProductReview productId={productId} loadReview={productState.loadReview || browserWidth < 1025} />
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