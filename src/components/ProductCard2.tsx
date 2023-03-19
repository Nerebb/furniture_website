import useProductFilter from '@/hooks/useProductFilter'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductCard } from '@/pages/api/products'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import Card from './Card'
import Chip from './Chip'
import Loading from './static/Loading'

export type ProductCardProps = {
    type?:
    | 'horizontal'
    | 'vertical'
    product?: ProductCard

    //Tailwind Modify
    modify?: {
        card?: string,
        text?: string,
        chip?: string,
    }
}

export default function ProductCard2({ type = 'vertical', product, modify }: ProductCardProps) {

    const categories = useProductFilter({ filter: 'category' })
    const price = fCurrency(product?.price as number)

    function handleChipOnClick() {

    }

    return (
        <Fragment>
            {product && (
                <Card modify={classNames(
                    'relative group',
                    modify?.card ? modify.card : 'min-w-[230px] aspect-3/4'
                )}>
                    {categories.isLoading ? (
                        <div className='h-full w-full flex-center'>
                            <Loading className='w-6 h-6 fill-priBlue-500 text-priBlack-200/50' />
                        </div>
                    ) : (
                        <Link href={`/products/${product.id}`} id={product.id} className='h-full'>
                            <Image
                                className='rounded-3xl -z-10'
                                alt=''
                                src={typeof (product.imageUrl) === "string" ? product.imageUrl : product.imageUrl![0]}
                                fill
                                sizes="(max-width:1000px): 100vw"
                                priority={true}
                            />
                            <div className={classNames(
                                'hidden rounded-3xl group-hover:grid grid-rows-5 h-full backdrop-blur-sm bg-priBlack-200 bg-opacity-30 px-3', modify?.text
                            )}>
                                <div className='row-span-2'></div>
                                <p className='w-full flex justify-between self-end'>
                                    <span className='capitalize'>
                                        <p>{product.name}</p>
                                    </span>
                                    <span className='text-priBlue-700'>{price}</span>
                                </p>
                                <p>
                                    {product.colors?.length && product.colors?.map(i => (
                                        <Chip
                                            key={i}
                                            label={GetColorName(i)}
                                            modify={modify?.chip}
                                            color={i} onClick={handleChipOnClick}
                                        />
                                    ))}
                                </p>
                            </div>
                        </Link>
                    )}
                </Card>
            )}
        </Fragment >
    )
}