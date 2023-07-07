import ProductGrid from '@/components/ProductGrid';
import ProductSideMenu from '@/components/static/ProductSideMenu';
import SideMenuLayout from '@/layouts/SideMenuLayout';
import { useState } from 'react';
import useSearchProduct from '@/hooks/useSearchProduct';

type Props = {}

export default function Index({ }: Props) {
    const searchQueries = useSearchProduct()
    const [loadMore, setLoadMore] = useState<number>(0)
    return (
        <SideMenuLayout tabTitle='Product search' sideMenu={<ProductSideMenu />}>
            <ProductGrid
                {...searchQueries}
                queryKey={['SearchProduct', searchQueries]}
                loadMore={loadMore}
                setLoadMore={setLoadMore}
            />
        </SideMenuLayout>
    )
}