import AssignForm from '@/components/form/AssignForm'
import AccDropMenu from '@/components/static/Account/AccDropMenu'
import SearchBox from '@/components/static/SearchBox'
import ShoppingCart from '@/components/static/ShoppingCart'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MainHeader() {
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
                <div className='mr-3'>
                    <ShoppingCart />
                </div>
                <p className="stash mr-3">|</p>
                {session ? (
                    <AccDropMenu />
                ) : (
                    <div className='space-x-3 flex'>
                        <AssignForm type='login' btnProps={{ text: 'Login', variant: 'outline', glowModify: 'noAnimation' }} />
                        <AssignForm type='register' btnProps={{ text: 'Sign up', glowModify: 'noAnimation' }} />
                    </div>
                )}
            </nav>
        </header>
    )
}