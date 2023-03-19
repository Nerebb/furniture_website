import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Fragment, ReactNode } from 'react';
import { AccSideMenuNav } from './Account/AccSideMenu';


type Props = {
    title: ReactNode;
    data: AccSideMenuNav[];
    modifyIcon?: string;
}

export default function DropMenu({ title, data, modifyIcon }: Props) {
    return (
        <div className='text-right'>
            <Menu as="div" className="relative">
                <Menu.Button className={'rounded-full hover:ring-2 flex-center'}>{title}</Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className='min-w-[150px] bg-white border divide-y divide-priGray-200/50 rounded-md absolute right-0'>
                        <div>
                            {data.map(nav => (
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
                        </div>
                        <div >
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            'bg-priBlack-200/40',
                                            'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                        )}
                                        onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
                                    >
                                        <ArrowRightOnRectangleIcon width={24} />
                                        <p>Sign out</p>
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}