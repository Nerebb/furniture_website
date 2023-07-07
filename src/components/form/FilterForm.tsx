import useSearchProduct from '@/hooks/useSearchProduct'
import { buildQuery } from '@/libs/utils/buildQuery'
import { ProductSearch } from '@/pages/api/products'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ComponentProps, ReactNode, useMemo } from 'react'
import Button from '../Button'
import Loading from '../static/Loading'

type Props = {
    classname?: ComponentProps<'form'>['className']
    children: ReactNode
}

export default function FilterForm({ classname, children }: Props) {
    const searchProduct = useSearchProduct()
    const router = useRouter()
    const initValues: ProductSearch = useMemo(() => {
        return {
            fromPrice: searchProduct?.fromPrice,
            toPrice: searchProduct?.toPrice,
            cateId: searchProduct?.cateId,
            colorHex: searchProduct?.colorHex,
            roomId: searchProduct?.roomId,
        }
    }, [searchProduct])

    async function handleOnSubmit(values: ProductSearch, { setSubmitting }: FormikHelpers<ProductSearch>) {
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 500)); // Debounce
        const url = buildQuery('/products', { ...values })
        router.push(url)
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
                            <Button
                                type='submit'
                                text='Submit'
                                glowModify='noAnimation'
                                modifier='w-32 h-8 dark:text-white'
                            />
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    )
}