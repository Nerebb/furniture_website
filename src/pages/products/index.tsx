import ProductGrid from '@/components/ProductGrid';
import ProductSideMenu from '@/components/static/ProductSideMenu';
import { SearchProductContext } from '@/contexts';
import SideMenuLayout from '@/layouts/SideMenuLayout';
import Head from 'next/head';
import { useContext, useState } from 'react';

type Props = {}

//**search query*/

export default function Index({ }: Props) {
    const data = useContext(SearchProductContext)
    const [loadMore, setLoadMore] = useState<number>(0)
    return (
        <SideMenuLayout tabTitle='Product search' sideMenu={<ProductSideMenu />}>
            <ProductGrid queryKey={['SearchProduct', "SearchPage"]} {...data?.searchContext} loadMore={loadMore} setLoadMore={setLoadMore} />
        </SideMenuLayout>
    )
}