import { ProductSearch } from "@/pages/api/products";
import { createContext, Dispatch, SetStateAction } from "react";

export type SearchContext = {
    searchContext: ProductSearch
    setSearchContext: Dispatch<SetStateAction<ProductSearch>>
}

export const SearchProductContext = createContext<SearchContext | null>(null)
