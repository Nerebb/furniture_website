import SwiperContainer from '@/components/Swiper/SwiperContainer';
import { ProductCard } from '@/pages/api/products';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import Loading from '../Loading';

type Props = {
    images?: { id: number, imageUrl: string }[]
}

export default function ProductImages({ images }: Props) {
    const [imageIdx, setImageIdx] = useState<number>(0)

    function handleChangeImages(idx: number) {
        setImageIdx(idx)
    }

    return (
        <div className='flex'>
            <div className="flex w-4/5 h-auto pr-5 mb-5">
                <div className="w-full aspect-square relative">
                    {images ? (
                        <Image alt='' src={images[imageIdx].imageUrl} className='object-cover' fill />
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>

            {/* ImageCarousel */}
            {images && <div className="w-1/5 px-5 py-10">
                {images.map((image, idx) => (
                    <Fragment key={image.id}>
                        <div className="bg-blue-400 w-full aspect-square relative mb-7 cursor-pointer" onClick={() => handleChangeImages(idx)}>
                            <Image alt='' src={image.imageUrl} className='object-cover' fill />
                        </div>
                    </Fragment >
                ))}
            </div>}
        </div>
    )
}