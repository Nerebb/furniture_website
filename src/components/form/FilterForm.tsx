import { useSearchContext } from '@/contexts/searchProductContext'
import axios from '@/libs/axiosApi'
import { ProductSearch } from '@/pages/api/products'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { ComponentProps, ReactNode, useMemo } from 'react'
import Button from '../Button'
import Loading from '../static/Loading'

type Props = {
    classname?: ComponentProps<'form'>['className']
    children: ReactNode
}

// type FilterForm = Partial<{ [key in FilterCardProps['name']]: string[] | number[] }>

export default function FilterForm({ classname, children }: Props) {
    const { searchContext, setSearchContext } = useSearchContext()
    const queryClient = useQueryClient()
    const initValues: ProductSearch = useMemo(() => {
        return {
            fromPrice: searchContext.fromPrice,
            toPrice: searchContext.toPrice,
            cateId: searchContext.cateId,
            colorHex: searchContext.colorHex,
            roomId: searchContext.roomId,
        }
    }, [searchContext])

    async function handleOnSubmit(values: ProductSearch, { setSubmitting }: FormikHelpers<ProductSearch>) {

        await new Promise(r => setTimeout(r, 500)); // Debounce
        const { cateId, colorHex, roomId } = values
        queryClient.fetchInfiniteQuery({
            queryKey: ['SearchProduct', searchContext],
            queryFn: ({ pageParam = { cateId: cateId, colorHex: colorHex, roomId: roomId } }) => axios.getProducts({
                cateId: pageParam.cateId,
                roomId: pageParam.roomId,
                colorHex: pageParam.colorHex,
            })
        })

        setSearchContext({ ...values })
        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={initValues}
            onSubmit={handleOnSubmit}
        >
            {({ isSubmitting }) => (
                <Form className={classname}>
                    {children}
                    <div className='w-full flex-center'>
                        {isSubmitting ? (
                            <Button modifier='w-32 h-8 flex-center' glowModify='noAnimation'>
                                <Loading className='w-6 h-6 fill-priBlue-500' />
                            </Button>
                        ) : (
                            <Button type='submit' text='Submit' glowModify='noAnimation' modifier='w-32 h-8' />
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    )
}