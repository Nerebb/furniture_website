import axios, { allowedFilter } from '@/libs/axiosApi'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import React from 'react'

type Props = {
    filter: typeof allowedFilter[number]
}

export default function useProductFilter({ filter }: Props) {
    const { data, isError, error, isLoading } = useQuery({
        queryKey: [filter],
        queryFn: () => axios.getFilter(filter)
    })
    return { data, isError, error, isLoading }
}