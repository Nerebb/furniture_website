import axios from '@/libs/axiosApi'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import AvatarLost from '../AvatarLost'

export type AccSideMenuNav = {
    id: number,
    label: string,
    href: string,
    navIcon: ReactNode,
    element: ReactNode,
}

type Props = {
    data: AccSideMenuNav[]
}

export default function AccSideMenu({ data }: Props) {
    const router = useRouter()
    const { isLoading, isError, data: userProfile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => axios.getUser(),
    })
    return (
        <section className='min-w-[400px] bg-white dark:bg-priBlack-700'>
            {userProfile && <article className='flex mb-2 space-x-5 rounded-2xl bg-priBlue-100 px-5 py-7 dark:bg-priBlack-800'>
                <aside className='relative rounded-full w-14 h-14'>
                    {userProfile.image ? (
                        <Image className='rounded-full h-full w-full' src={userProfile.image} fill alt='' />
                    ) : (
                        <AvatarLost />
                    )}
                </aside>
                <aside className='flex flex-col justify-between'>
                    <h1 className='text-lg font-semibold dark:text-white'>{userProfile.name}</h1>
                    <p className='text-priBlack-500 dark:text-gray-200'>{userProfile.email}</p>
                </aside>
            </article>}
            <article className='space-y-2'>
                {data.map(nav => (
                    <Link
                        href={nav.href}
                        key={nav.id}
                        className={classNames(
                            'flex rounded-xl space-x-3 group px-5 py-7 transition-all ease-out duration-70',
                            'hover:bg-priBlack-100/50 dark:hover:bg-priBlack-800 dark:text-white',
                            { 'bg-priBlack-100/50 dark:bg-priBlack-800': router.asPath === nav.href }
                        )}>
                        {nav.navIcon}
                        <h1>{nav.label}</h1>
                    </Link>
                ))}
            </article>
        </section>
    )
}