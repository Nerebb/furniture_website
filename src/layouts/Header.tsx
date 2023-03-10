import Button from '@/components/Button'
import Modal from '@/components/Modal'
import SearchBox from '@/components/SearchBox'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
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
                    <>
                        <Button text='Sign out' onClick={() => signOut()} />
                    </>
                ) : (
                    <>
                        <Link className='SignUp tracking-tight mr-3' href={'/login'}>Sign Up</Link>
                        <Modal btnProps={{ text: 'Login' }} formType='login' />
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header