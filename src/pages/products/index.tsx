import ProductGrid from '@/components/ProductGrid';
import ProductSideMenu from '@/components/static/ProductSideMenu';
import { useSearchContext } from '@/contexts/searchProductContext';
import SideMenuLayout from '@/layouts/SideMenuLayout';
import { useState } from 'react';

type Props = {}

//**search query*/

export default function Index({ }: Props) {
    const { searchContext } = useSearchContext()
    const [loadMore, setLoadMore] = useState<number>(0)
    return (
        <SideMenuLayout tabTitle='Product search' sideMenu={<ProductSideMenu />}>
            <ProductGrid
                {...searchContext}
                queryKey={['SearchProduct', searchContext]}
                loadMore={loadMore}
                setLoadMore={setLoadMore}
            />
        </SideMenuLayout>
    )
}