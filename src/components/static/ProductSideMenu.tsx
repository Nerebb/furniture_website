import axios from '@/libs/axiosApi'
import { Color } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import FilterCard from '../form/FilterCard'
import FilterForm from '../form/FilterForm'

type Props = {}

export default function ProductSideMenu({ }: Props) {
    const categories = useQuery({
        queryKey: ['category'],
        queryFn: () => axios.getFilter('category'),
    })
    const colors = useQuery({
        queryKey: ['color'],
        queryFn: () => axios.getFilter('color'),
    })
    const rooms = useQuery({
        queryKey: ['room'],
        queryFn: () => axios.getFilter('room'),
    })

    return (
        <FilterForm>
            <FilterCard title='categories' data={categories.data} isLoading={categories.isLoading} />
            <FilterCard title='colors' data={colors.data} isLoading={colors.isLoading} />
            <FilterCard title='rooms' data={rooms.data} isLoading={rooms.isLoading} />
        </FilterForm>
    )
}