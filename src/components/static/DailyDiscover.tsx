import Section from '@/layouts/Section'
import axios from '@/libs/axiosApi'
import { ProductCard, ProductSearch } from '@/pages/api/products'
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import ProductGrid from '../ProductGrid'


const DailyDiscover = () => {
    const [curFilter, setCurFilter] = useState<number>(0)
    const [loadMore, setLoadMore] = useState<number>(0)
    const queryClient = useQueryClient()
    const categories = useQuery({
        queryKey: ['category'],
        queryFn: () => axios.getFilter('category'),
    })

    const cateFilter = useMemo(() => {
        let rdCate: { id: number | string, name: string }[] = [
            { id: 0, name: "all Product" }
        ];
        if (categories.data) categories.data.forEach((i, idx) => { if (idx < 6) return rdCate.push(i) })
        return rdCate
    }, [categories])

    function handleCateFilter(id: number) {
        setCurFilter(id)
        setLoadMore(0)
        queryClient.fetchInfiniteQuery({
            queryKey: ['DailyDiscover', `${id}`],
            queryFn:
                ({ pageParam = { skip: 0, cateId: id } }) => axios.getProducts({
                    skip: pageParam.skip,
                    cateId: id === 0 ? undefined : [id]
                }),
        })
    }

    return (
        <Section title="DailyDiscover">
            {/* Catergory */}
            <div className="flex justify-start items-center text-gray-500 space-x-4">
                {cateFilter &&
                    cateFilter.map((item) => (
                        <p
                            key={`discover-${item.id}`}
                            id={`${item.id}`}
                            className={`cursor-pointer capitalize ${curFilter === item.id ? "bold-Underline" : ""}`}
                            onClick={() => handleCateFilter(parseInt(item.id as string))}
                        >
                            {item.name}
                        </p>
                    ))}
            </div>

            {/* Product Grid */}
            <ProductGrid queryKey={['DailyDiscover', `${curFilter}`]} cateId={[curFilter]} loadMore={loadMore} setLoadMore={setLoadMore} />
        </Section>
    )
}

export default DailyDiscover