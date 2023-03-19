import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

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
    return (
        <section className='min-w-[400px]'>
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
                {data.map(nav => (
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