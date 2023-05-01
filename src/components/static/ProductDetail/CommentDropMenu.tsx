import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon, Bars3Icon, FlagIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import { Dispatch, Fragment, SetStateAction } from 'react';

type Props = {
    ownerId: string,
    isEdited?: boolean,
    setIsEdited: Dispatch<any>
}

export default function CommentDropMenu({ ownerId, isEdited, setIsEdited }: Props) {
    const { data: session } = useSession()
    const isOwned = session?.id === ownerId
    return (
        <Menu as="div" className="relative">
            <Menu.Button className={'rounded-full hover:ring-2 flex-center'}>
                <div className='flex items-center p-0.5'>
                    < Bars3Icon width={24} height={24} />
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
                <Menu.Items className='min-w-[120px] bg-white border divide-y divide-priGray-200/50 rounded-md absolute right-0'>
                    <div>
                        {isOwned && (
                            !isEdited ? (
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            className={classNames(
                                                'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                                {
                                                    'bg-priBlue-200/70': active,
                                                }
                                            )}
                                            onClick={() => setIsEdited(true)}
                                        >
                                            <PencilSquareIcon className='w-6 h-6' />
                                            <p>Edit</p>
                                        </div>
                                    )}
                                </Menu.Item>
                            ) : (
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            className={classNames(
                                                'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                                {
                                                    'bg-priBlue-200/70': active,
                                                }
                                            )}
                                            onClick={() => setIsEdited(false)}
                                        >
                                            <PencilSquareIcon className='w-6 h-6' />
                                            <p>Close</p>
                                        </div>
                                    )}
                                </Menu.Item>
                            ))}
                        {!isOwned && <Menu.Item>
                            {({ active }) => (
                                <div
                                    className={classNames(
                                        'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2 text-red-500',
                                        {
                                            'bg-red-200/70': active
                                        }
                                    )}
                                >
                                    <FlagIcon className='w-6 h-6' />
                                    <p>Report</p>
                                </div>
                            )}
                        </Menu.Item>}
                    </div>
                    {isOwned && <Menu.Item>
                        {({ active }) => (
                            <button
                                className={classNames(
                                    'bg-priBlack-200/20',
                                    'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                )}
                                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
                            >
                                <ArrowRightOnRectangleIcon width={24} />
                                <p>Delete</p>
                            </button>
                        )}
                    </Menu.Item>}
                </Menu.Items>
            </Transition>
        </Menu >
    )
}