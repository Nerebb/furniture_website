import { ProductSearch } from '@/pages/api/products'
import { ReactNode, useContext, useMemo, useState } from 'react'
import { SearchProductContext } from '.'

type Props = {
    children: ReactNode
}

export const initSearchContext: ProductSearch = {
    limit: 8,
    skip: undefined,
    available: false,
    cateId: undefined,
    colorHex: undefined,
    createdDate: undefined,
    creatorName: undefined,
    name: undefined,
    fromPrice: undefined,
    toPrice: undefined,
    rating: undefined,
    roomId: undefined,
}


export default function SearchProvider({ children }: Props) {
    const [searchContext, setSearchContext] = useState<ProductSearch>(initSearchContext)
    const searchMemo = useMemo(() => ({ searchContext, setSearchContext }), [searchContext, setSearchContext])
    return (
        <SearchProductContext.Provider value={{ ...searchMemo }}>
            {children}
        </SearchProductContext.Provider>
    )
}

export function useSearchContext() {
    const searchContext = useContext(SearchProductContext)
    if (!searchContext) throw new Error("searchContext must be used within <SearchProductContext.Provider/>")
    return { ...searchContext }
}