import Loading from '@/components/static/Loading'
import { ProductSearch } from '@/pages/api/products'
import { ComponentProps, Fragment, PropsWithChildren } from 'react'
import Card from '../Card'
import FormikField from './FormikField'

export type checkBoxProps = {
    id: string | number,
    label: string,
}

export type FilterCardProps = {
    title?: string
    className?: ComponentProps<'div'>['className'],
    name?: keyof ProductSearch,
    data?: checkBoxProps[],
    isLoading?: boolean,
}

export default function FilterCard({ className, title, data, name, children, isLoading = true }: PropsWithChildren<FilterCardProps>) {
    return (
        <Card type='SearchCard' modify={className}>
            {/* Title */}
            {title && <h1 className='capitalize text-lg font-semibold border-b'>{title}</h1>}

            {isLoading &&
                <div className='flex-center min-h-[150px]'>
                    <Loading className='w-6 h-6 fill-priBlue-500 text-priBlack-200/50' />
                </div>
            }

            {children}

            {/* Form */}
            {data && <div className='grid grid-cols-2 space-y-1 py-2'>
                {data.map(i => (
                    <Fragment key={`${i.label}-${i.id}`}>
                        <FormikField
                            type='checkbox'
                            id={`${i.id}`}
                            label={i.label}
                            name={name || "UnNamedCheckboxes"}
                        />
                    </Fragment>
                ))}
            </div>}
        </Card>
    )
}