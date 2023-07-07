import { ProductSearchSchemaValidate } from '@/libs/schemaValitdate'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import * as Yup from 'yup'

export default function useSearchProduct() {
    const router = useRouter()
    //This validation just for transform queries into right types.
    //But for debugging purpose, still catch error if any happens
    const searchContext = useMemo(() => {
        try {
            const query = router.query
            if (!query) return
            const params = Yup.object(ProductSearchSchemaValidate).validateSync(query, { recursive: false, stripUnknown: true })
            return params
        } catch (error: any) {
            console.log("SearchProductParams", error.message)
        }
    }, [router.query])

    return searchContext
}