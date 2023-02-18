import BaseLayout from '@/layouts/BaseLayout'
import React from 'react'
import { BeakerIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';

type Props = {}

//**search query*/

export default function index({ }: Props) {
    return (
        <BaseLayout>
            <div className='flex'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex pt-6'>
                        <div className="flex flex-col w-4/5">
                            <div className="w-full aspect-square bg-red-100 relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill/>
                            </div>
                        </div>
                        <div className="flex flex-wrap w-1/5 items-center py-7 px-5">
                            <div className="bg-blue-400 w-full aspect-square mb-5 relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill/>
                            </div>
                            <div className="bg-blue-400 w-full aspect-square mb-5 relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill/>
                            </div>
                            <div className="bg-blue-400 w-full aspect-square mb-5 relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill/>
                            </div>
                            <div className="bg-blue-400 w-full aspect-square relative">
                                <Image alt='' src='/images/OliverSofa_RS.jpg' className='object-cover' fill/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-1/2 px-10 pt-6 border-l-2'>
                    <div className='flex items-center justify-between mb-5'>
                        <h1 className="text-[32px] font-bold">Ilana</h1>
                        <BeakerIcon className="h-6 w-6 text-blue-500"/>
                    </div>

                    <p className='mb-6'> Lorem ipsum dolor sit amet consectetur, adipisicing elit. In temporibus eum praesentium ut, accusantium vero veritatis officia porro voluptatem consequuntur nobis sit necessitatibus enim debitis voluptates, distinctio quos id? Debitis!</p>

                    <div className="font-bold text-[25px] mb-5">
                        <span className="mr-2">$</span>
                        <span>430.99</span>
                    </div>

                    <div className="flex mb-7">
                        <div className="flex mr-3">
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1"/>
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1"/>
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1"/>
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1"/>
                            <BeakerIcon className="h-6 w-6 text-blue-500 mr-1"/>
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