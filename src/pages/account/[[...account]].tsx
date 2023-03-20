import AccOrder from '@/components/static/Account/AccOrder'
import AccProfile from '@/components/static/Account/AccProfile'
import AccPurchased from '@/components/static/Account/AccPurchased'
import AccSideMenu from '@/components/static/Account/AccSideMenu'
import AccWishlist from '@/components/static/Account/AccWishlist'
import SideMenuLayout from '@/layouts/SideMenuLayout'
import { ChartBarSquareIcon, ClipboardDocumentListIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

type Props = {
}

const iconStyle = {
    width: 24
}

export const AccPage = [
    {
        id: 0,
        label: 'My Account',
        href: '/account',
        navIcon: <UserCircleIcon style={iconStyle} />,
        element: <AccProfile />
    },
    {
        id: 1,
        label: 'Wish list',
        href: '/account/wishlist',
        navIcon: <HeartIcon style={iconStyle} />,
        element: <AccWishlist />

    },
    {
        id: 2,
        label: 'Order status',
        href: '/account/orderstatus',
        navIcon: <ChartBarSquareIcon style={iconStyle} />,
        element: <AccOrder />
    },
    {
        id: 3,
        label: 'Purchased',
        href: '/account/purchased',
        navIcon: <ClipboardDocumentListIcon style={iconStyle} />,
        element: <AccPurchased />
    },
]

export default function Account({ }: Props) {
    const router = useRouter()

    const render = AccPage.find(i => i.href === router.asPath)?.element
    return (
        <SideMenuLayout sideMenu={<AccSideMenu data={AccPage} />} tabTitle='User detail'>
            {render}
        </SideMenuLayout>
    )
}
