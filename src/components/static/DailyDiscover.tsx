import useProductFilter from '@/hooks/useProductFilter'
import Section from '@/layouts/Section'
import axios from '@/libs/axiosApi'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import ProductGrid from '../ProductGrid'
import useBrowserWidth from '@/hooks/useBrowserWidth'


const DailyDiscover = () => {
    const queryClient = useQueryClient()
    const browserWidth = useBrowserWidth()
    const [curFilter, setCurFilter] = useState<number>(0)
    const [loadMore, setLoadMore] = useState<number>(0)
    const { data: categories } = useProductFilter({ filter: "category" })

    const cateFilter = useMemo(() => {
        let rdCate: { id: number | string, label: string }[] = [
            { id: 0, label: "all Product" }
        ];
        const length = browserWidth < 500 ? 2 : 6
        if (categories) categories.forEach((i, idx) => {
            if (idx < length) return rdCate.push({ id: i.id, label: i.label })
        })
        return rdCate
    }, [categories, browserWidth])

    function handleCateFilter(id: number) {
        setCurFilter(id)
        setLoadMore(0)
        queryClient.fetchInfiniteQuery({
            queryKey: ['DailyDiscover', `${id}`],
            queryFn:
                ({ pageParam = { limit: 12, skip: 0, cateId: id } }) => axios.getProducts({
                    limit: pageParam.limit,
                    skip: pageParam.skip,
                    cateId: id === 0 ? undefined : [id]
                }),
        })
    }
    return (
        <Section title="DailyDiscover">
            {/* Catergory */}
            <div className="flex justify-start items-center text-gray-500 space-x-4 dark:text-white">
                {cateFilter &&
                    cateFilter.map((item) => (
                        <p
                            key={`discover-${item.id}`}
                            id={`${item.id}`}
                            className={`cursor-pointer capitalize dark:text-white ${curFilter === item.id ? "bold-Underline" : ""}`}
                            onClick={() => handleCateFilter(parseInt(item.id as string))}
                        >
                            {item.label}
                        </p>
                    ))}
            </div>

            {/* Product Grid */}
            <div className='mt-5'>
                <ProductGrid
                    queryKey={['DailyDiscover', `${curFilter}`]}
                    cateId={[curFilter]}
                    loadMore={loadMore}
                    setLoadMore={setLoadMore}
                    cardProps={{ modify: { text: "text-xl", chip: "text-lg px-3 py-0.5 mr-3 mb-3" } }}
                />
            </div>
        </Section>
    )
}

export default DailyDiscover