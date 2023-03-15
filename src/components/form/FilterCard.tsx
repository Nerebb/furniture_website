import Loading from '@/components/static/Loading'
import { FormRow } from '@types'
import React, { PropsWithChildren, ReactNode } from 'react'
import Card from '../Card'
import FormikField from './FormikField'

export type checkBoxProps = {
    id: string | number,
    name: string,
}

export type FilterCardProps = {
    title:
    | 'rooms'
    | 'colors'
    | 'categories',
    data?: checkBoxProps[],
    isLoading: boolean,
}

export default function FilterCard({ title, data, children, isLoading = true }: PropsWithChildren<FilterCardProps>) {
    return (
        <Card type='SearchCard'>
            {/* Title */}
            <h1 className='capitalize text-lg font-semibold border-b'>{title}</h1>

            {isLoading && <Loading />}

            {children}

            {/* Form */}
            {data && <div className='grid grid-cols-2 space-y-1 py-2'>
                {data.map(i => (
                    <div key={i.id} className=''>
                        <FormikField
                            type='checkbox'
                            id={`${i.id}`}
                            label={i.name}
                            name={title}
                        />
                    </div>
                ))}
            </div>}
        </Card>
    )
}