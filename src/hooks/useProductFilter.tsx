import axios, { allowedFilter } from '@/libs/axiosApi'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import React, { useEffect } from 'react'

type Props = {
    filter: typeof allowedFilter[number]
    limit?: number
}

export default function useProductFilter({ filter, limit }: Props) {
    const { data, isError, error, isLoading } = useQuery({
        queryKey: [filter],
        queryFn: () => axios.getFilter(filter, limit)
    })
    return { data, isError, error, isLoading }
}