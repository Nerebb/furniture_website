import Image from 'next/image'
import React, { useContext, useState } from 'react'
import Section from '../layouts/Section'
import Button from './Button'

const Category = [
    { id: 0, label: 'Sofas' },
    { id: 1, label: 'Chair' },
    { id: 2, label: 'Table' },
    { id: 3, label: 'Bed' },
    { id: 4, label: 'New arrive' },
    { id: 5, label: 'Ottomans' },
    { id: 6, label: 'Shelves' },
    { id: 7, label: 'Accessories' },
    { id: 8, label: 'Stools' },
    { id: 9, label: 'Wardropes' },
]

const Products = [
    {
        id: 0,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 1,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 2,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 3,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 4,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 5,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 6,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 7,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 8,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 9,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 10,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 11,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 12,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 13,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 14,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
    {
        id: 15,
        name: 'Sofa',
        imageUrl: '/images/OliverSofa_RS.jpg',
        category: 'Living room'
    },
]

const DailyDiscover = () => {
    const [curFilter, setCurFilter] = useState<string>('All Products')
    const [loadMore, setLoadMore] = useState<number>(8)

    return (
        <Section title="DailyDiscover">
            {/* Catergory */}
            <div className="flex justify-start items-center text-gray-500 space-x-4">
                <p
                    className={`cursor-pointer ${curFilter === "All Products" ? "bold-Underline" : ""}`}
                    onClick={() => setCurFilter('All Products')}
                >
                    All Products
                </p>
                {
                    Category.map((item) => (
                        <p
                            key={item.id}
                            className={`cursor-pointer ${curFilter === item.label ? "bold-Underline" : ""}`}
                            onClick={() => setCurFilter(item.label)}
                        >
                            {item.label}
                        </p>
                    ))}
            </div>

            {/* Product Grid */}
            <div className='grid gap-5 grid-cols-4 my-5'>
                {Products.map((item, idx) => (
                    idx < loadMore &&
                    <div key={item.id} className='h-auto relative rounded-3xl aspect-3/4'>
                        <Image className='rounded-3xl' alt='' src={typeof (item.imageUrl) === "string" ? item.imageUrl : item.imageUrl[0]} fill priority={true} />
                    </div>
                ))}
            </div>
            <div className='w-full flex justify-center'>
                <Button text='Load more' onClick={() => setLoadMore(i => i + 8)} />
            </div>
        </Section>
    )
}

export default DailyDiscover