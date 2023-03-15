import { SearchContext, SearchProductContext } from '@/contexts'
import { useSearchContext } from '@/contexts/searchProductContext'
import axios from '@/libs/axiosApi'
import { ProductCard, ProductSearch } from '@/pages/api/products'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { Context, ReactNode, useContext, useMemo } from 'react'
import Button from '../Button'
import Loading from '../static/Loading'
import { FilterCardProps } from './FilterCard'

type Props = {
    children: ReactNode
}

type FilterForm = Partial<{ [key in FilterCardProps['title']]: string[] | number[] }>

export default function FilterForm({ children }: Props) {
    const { searchContext, setSearchContext } = useSearchContext()
    const queryClient = useQueryClient()
    const initValues: FilterForm = useMemo(() => {
        return {
            categories: searchContext.cateId,
            colors: searchContext.colorHex,
            rooms: searchContext.roomId,
        }
    }, [searchContext])

    async function handleOnSubmit(values: FilterForm, { setSubmitting }: FormikHelpers<FilterForm>) {
        console.log("🚀 ~ file: FilterForm.tsx:21 ~ handleOnSubmit ~ values:", values)

        await new Promise(r => setTimeout(r, 500)); // Debounce
        const { categories, colors, rooms } = values
        queryClient.fetchInfiniteQuery({
            queryKey: ['SearchProduct', searchContext],
            queryFn: ({ pageParam = { cateId: categories, colorHex: colors, roomId: rooms } }) => axios.getProducts({
                //Santinize
                cateId: pageParam.cateId,
                roomId: pageParam.roomId,
                colorHex: pageParam.colorHex,
            })
        })

        setSearchContext({
            cateId: categories as number[],
            colorHex: colors as string[],
            roomId: rooms as number[]
        })
        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={initValues}
            onSubmit={handleOnSubmit}
        >
            {({ isSubmitting }) => (
                <Form className='space-y-5'>
                    {children}
                    <div className='w-full flex-center'>
                        {isSubmitting ? <Button modifier='w-32 h-8 flex-center' glowModify='noAnimation'><Loading className='w-6 h-6 fill-priBlue-500' /></Button> : <Button type='submit' text='Submit' glowModify='noAnimation' modifier='w-32 h-8' />}
                    </div>
                </Form>
            )}
        </Formik>
    )
}