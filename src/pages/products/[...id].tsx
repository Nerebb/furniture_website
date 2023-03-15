import BaseLayout from '@/layouts/BaseLayout';
import { BeakerIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

type Props = {}

//background : color-priBlue-500

//Text- Title : color : text-black
//Text - <p></p> : text-gray-500

export default function ProductDetail({ }: Props) {
    return (
        <BaseLayout>
            <div className='flex px-10'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex pt-6'>
                        <div className="flex flex-col w-4/5">
                            <div className="w-full aspect-square bg-red-100 relative mb-8">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                            </div>

                            <div className="flex justify-between items-center mb-5">
                                <h1 className="font-semibold">Recently viewed</h1>
                                <div className='flex gap-5'>
                                    <button className='w-7 bg-red-50 rounded-full'>
                                        <ChevronLeftIcon />
                                    </button>
                                    <button className='w-7 bg-red-50 rounded-full'>
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <div className="w-full aspect-square bg-red-100 relative mb-2">
                                        <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Lottie</p>
                                        <div className='font-semibold'>
                                            <span className='mr-1'>$</span>
                                            <span>1.2</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="w-full aspect-square bg-red-100 relative mb-2">
                                        <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Lottie</p>
                                        <div className='font-semibold'>
                                            <span className='mr-1'>$</span>
                                            <span>1.2</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="w-full aspect-square bg-red-100 relative mb-2">
                                        <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Lottie</p>
                                        <div className='font-semibold'>
                                            <span className='mr-1'>$</span>
                                            <span>1.2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/5 px-5 py-10">
                            <div className="bg-blue-400 w-full aspect-square relative mb-7">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                            </div>
                            <div className="bg-blue-400 w-full aspect-square relative mb-7">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                            </div>
                            <div className="bg-blue-400 w-full aspect-square relative mb-7">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                            </div>
                            <div className="bg-blue-400 w-full aspect-square relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-1/2 pl-10 pt-6 border-l-2'>
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className="text-[32px] font-bold">Ilana</h1>
                        <BeakerIcon className="h-6 w-6 text-blue-500" />
                    </div>

                    <p className='mb-6'> Lorem ipsum dolor sit amet consectetur, adipisicing elit. In temporibus eum praesentium ut, accusantium vero veritatis officia porro voluptatem consequuntur nobis sit necessitatibus enim debitis voluptates, distinctio quos id? Debitis!</p>

                    <div className="font-bold text-[25px] mb-5">
                        <span className="mr-2">$</span>
                        <span>430.99</span>
                    </div>

                    <div className="flex mb-7">
                        <div className="flex mr-3">
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1" />
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1" />
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1" />
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1" />
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1" />
                        </div>
                        <span className='underline'>441 reviews</span>
                    </div>

                    <div className="mb-20">
                        <p className="font-semibold mb-2">Colour</p>
                        <div className="flex">
                            <div className="h-10 w-10 bg-blue-50 rounded-full mr-5
                                        after:block after:border-b-4 after:border-black 
                                        after:w-7 after:m-auto after:-bottom-3 after:translate-y-12">
                            </div>
                            <div className="h-10 w-10 bg-red-50 rounded-full mr-5
                                        after:block after:border-b-4 after:border-black 
                                        after:w-7 after:m-auto after:-bottom-3 after:translate-y-12">
                            </div>
                            <div className="h-10 w-10 bg-yellow-50 rounded-full mr-5
                                        after:block after:border-b-4 after:border-black 
                                        after:w-7 after:m-auto after:-bottom-3 after:translate-y-12">
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button className="border-black border-solid border-2 px-14 py-3 font-semibold">
                            Buy now
                        </button>
                        <button className="bg-black px-14 py-3 font-semibold text-white">
                            Add to basket
                        </button>
                    </div>
                </div>
            </div>
        </BaseLayout>
    )
}