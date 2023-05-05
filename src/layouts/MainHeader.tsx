import AssignForm from '@/components/form/AssignForm'
import AccDropMenu from '@/components/static/Account/AccDropMenu'
import SearchBox from '@/components/static/SearchBox'
import ShoppingCart from '@/components/static/ShoppingCart'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NavMenu from './NavMenu'

export default function MainHeader() {
    const router = useRouter()
    const { data: session } = useSession()
    const browserWidth = useBrowserWidth()
    return (
        <header className={classNames(
            'flex justify-between items-center sticky top-0 w-full h-[80px] px-2 z-50 bg-white bg-opacity-40 backdrop-blur-sm',
            //Darkmode,
            'dark:bg-priBlack-700/40 bg-opacity-10 dark:text-white',
            {
                'border-b border-solid border-priBlack-100': router.asPath !== '/',
            },
        )}>
            <nav className='LeftHeader flex items-center space-x-2'>
                {browserWidth > 768 ? (
                    <>
                        <Link className="HomePage font-bold text-3xl mr-3" href={'/'}>NEREB</Link>
                        <Link className="Products" href={'/'}>Home</Link>
                        <Link className="Products" href={'/products'}>Products</Link>
                    </>
                ) : (
                    <>
                        <NavMenu />
                        <Link className="HomePage font-bold text-xl mr-3" href={'/'}>NEREB</Link>
                    </>
                )}
            </nav>
            <nav className="RightHeaderNav flex-1 flex justify-end items-center w-auto">
                <SearchBox />
                {browserWidth > 768 && (
                    <>
                        <div className='mr-3'>
                            <ShoppingCart />
                        </div>
                        <p className="stash mr-3">|</p>
                    </>
                )}
                {session ? (
                    <AccDropMenu />
                ) : browserWidth < 468 ? (
                    <AssignForm
                        type='login'
                        btnProps={{
                            text: 'Login',
                            glowModify: 'noAnimation',
                            modifier: browserWidth < 768 ? "text-md py-1 px-4 dark:text-white" : undefined
                        }}
                    />
                ) : (
                    <div className='space-x-3 md:space-x-2 flex'>
                        <AssignForm
                            type='login'
                            btnProps={{
                                text: 'Login',
                                variant: 'outline',
                                glowModify: 'noAnimation',
                                modifier: browserWidth < 768 ? "text-md py-1 px-4 dark:text-white" : undefined
                            }}
                        />
                        <AssignForm
                            type='register'
                            btnProps={{
                                text: 'Sign up',
                                glowModify: 'noAnimation',
                                modifier: browserWidth < 768 ? "text-md py-1 px-4" : undefined

                            }}
                        />
                    </div>
                )}
            </nav>
        </header>
    )
}