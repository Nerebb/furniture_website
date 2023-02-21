import { ChartBarSquareIcon, ClipboardDocumentListIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Gender, IUser } from '@types'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AccOrder from './static/Account/AccOrder'
import AccProfile from './static/Account/AccProfile'
import AccPurchased from './static/Account/AccPurchased'
import AccWishlist from './static/Account/AccWishlist'


type Props = {}

const iconStyle = {
    width: 24
}

export const fakeUser: IUser = {
    id: 0,
    name: "Nereb",
    password: "test12345",
    nickName: "render",
    address: "test distric 2 loreisum",
    email: "test@gmail.com",
    gender: Gender.others,
    phoneNumber: 1032423,
    birthDay: "27/04/1996",
}

export const AccPage = [
    {
        id: 0,
        label: 'My Account',
        href: '/account',
        navIcon: <UserCircleIcon style={iconStyle} />,
        element: <AccProfile userData={fakeUser} />
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

export default function SideMenu({ }: Props) {
    const router = useRouter()
    return (
        <section className=''>
            <article className='flex mb-2 space-x-5 rounded-2xl bg-priBlue-100 px-5 py-7'>
                <aside className='relative rounded-full w-14 h-14'>
                    <Image className='rounded-full h-full w-full' src={'/images/OliverSofa_RS.jpg'} fill alt='' />
                </aside>
                <aside className='flex flex-col justify-between'>
                    <h1 className='text-lg font-semibold'>Nereb</h1>
                    <p className='text-priBlack-500'>email@gmail.com</p>
                </aside>
            </article>
            <article className='space-y-2'>
                {AccPage.map(nav => (
                    <Link
                        href={nav.href}
                        key={nav.id}
                        className={classNames(
                            'flex rounded-xl space-x-3 group px-5 py-7 transition-all ease-out duration-700 hover:bg-priBlack-100/50',
                            { 'bg-priBlack-100/50': router.asPath === nav.href }
                        )}>
                        {nav.navIcon}
                        <h1>{nav.label}</h1>
                    </Link>
                ))}
            </article>
        </section>
    )
}