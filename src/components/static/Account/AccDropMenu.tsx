import useBrowserWidth from '@/hooks/useBrowserWidth';
import { AccPage } from '@/pages/account/[[...account]]';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Fragment } from 'react';
import SwitchTheme from '../SwitchTheme';

type Props = {
}

export default function AccDropMenu({ }: Props) {
    const browserWidth = useBrowserWidth()
    return (
        <div className='text-right'>
            <Menu as="div" className="relative">
                <Menu.Button className={'rounded-full hover:ring-2 flex-center'}>
                    <div className='flex items-center space-x-2 px-2 py-0.5'>
                        {browserWidth > 768 && <h1>My Account</h1>}
                        < UserCircleIcon width={28} />
                    </div>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        unmount={false}
                        className={classNames(
                            'min-w-[180px] absolute right-0 border divide-y divide-priGray-200/50 rounded-md bg-white',
                            'dark:bg-priBlack-600 dark:border-priBlack-200'
                        )}
                    >
                        {AccPage.map(nav => (
                            <Menu.Item key={nav.id}>
                                {({ active }) => (
                                    <Link
                                        href={nav.href}
                                        className={classNames(
                                            'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                            {
                                                'bg-priBlue-200/70': active
                                            }
                                        )}
                                    >
                                        {nav.navIcon}
                                        <p>{nav.label}</p>
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                        <Menu.Item >
                            {() => (
                                <SwitchTheme
                                    text="Switch theme"
                                    modifier={classNames(
                                        'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2 border-t-priGray-200/50',
                                        'hover:bg-priBlue-200/70 rounded-none',
                                    )}
                                    onClick={() => { "" }} //MenuItem e.preventDefault()
                                />
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={classNames(
                                        'bg-priBlack-200/40',
                                        'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2 rounded-b-md',
                                        'dark:bg-priBlack-800'
                                    )}
                                    onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
                                >
                                    <ArrowRightOnRectangleIcon width={24} />
                                    <p>Sign out</p>
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}