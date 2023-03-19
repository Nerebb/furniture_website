import Modal from '@/components/Modal'
import DropMenu from '@/components/static/DropMenu'
import SearchBox from '@/components/static/SearchBox'
import { AccPage } from '@/pages/account/[[...account]]'
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <header className={`flex justify-between items-center sticky top-0 w-full h-[80px] px-2 text-deskText1 text-priBlack z-50 bg-white bg-opacity-40 backdrop-blur-sm ${router.asPath !== '/' ? 'border-b border-solid border-priBlack-100' : ''}`}>
            <nav className='LeftHeader flex justify-between items-center w-[400px]'>
                <Link className="HomePage font-bold text-3xl mr-5 text-black" href={'/'}>NEREB</Link>
                <Link className="Products" href={'/'}>Home</Link>
                <Link className="Products" href={'/products'}>Products</Link>
                <Link className="Newsfeed" href={'/newsfeed'}>Newsfeed</Link>
            </nav>
            <nav className="RightHeaderNav flex-1 flex justify-end items-center w-auto">
                <SearchBox />
                <Link className='Cart mr-3' href={'/cart'}>
                    <ShoppingCartIcon className='w-6 h-6' />
                </Link>
                <p className="stash mr-3">|</p>
                {session ? (
                    <DropMenu title={<UserCircleIcon width={28} />} data={AccPage} />
                ) : (
                    <div className='space-x-3 flex'>
                        <Modal btnProps={{ text: 'Login', variant: 'outline', glowModify: 'noAnimation' }} formType='login' />
                        <Modal btnProps={{ text: 'Sign up', glowModify: 'noAnimation' }} formType='register' />
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header