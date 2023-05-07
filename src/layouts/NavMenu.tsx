import Modal from '@/components/Modal';
import ProductSideMenu from '@/components/static/ProductSideMenu';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { ArchiveBoxIcon, Bars3Icon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

type Props = {

}

function ProductSideModal({ modifier }: { modifier: string }) {
    return (
        <Modal
            type="-translateX"
            btnProps={{
                variant: "plain",
                text: "Filters",
                children: <MagnifyingGlassIcon width={24} />,
                modifier,
                glowEffect: false,
            }}
        >
            <Dialog.Panel
                className={classNames(
                    'max-w-[300px] sm:max-w-[420px] py-5 px-5 sm:pr-5 lg:border-r border-priBlack-100 bg-white dark:bg-priBlack-700'

                )}>
                <ProductSideMenu />
            </Dialog.Panel> */
        </Modal>
    )
}

function Test({ keepOpen }: { keepOpen?: string }) {
    return (<Modal
    />)
}

export default function NavMenu({ }: Props) {
    const router = useRouter()

    return (
        <div className='text-left'>
            <Test />
            <Menu as="div" className="relative">
                <Menu.Button
                    className={'p-1 flex-center rounded-full flex-center'}
                >
                    <Bars3Icon width={24} />
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
                            'min-w-[150px] absolute left-0 border divide-y divide-priGray-200/50 rounded-md bg-white',
                            'dark:bg-priBlack-600 dark:border-priBlack-200'
                        )}
                    >
                        <Menu.Item >
                            {({ active }) => (
                                <Link
                                    href={'/'}
                                    className={classNames(
                                        'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                        {
                                            'bg-priBlue-200/70': active
                                        }
                                    )}
                                >
                                    <HomeIcon width={24} />
                                    <p>Home</p>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item >
                            {({ active }) => (
                                <Link
                                    href={'/products'}
                                    className={classNames(
                                        'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                        {
                                            'bg-priBlue-200/70': active
                                        }
                                    )}
                                >
                                    <ArchiveBoxIcon width={24} />
                                    <p>Products</p>
                                </Link>
                            )}
                        </Menu.Item>
                        {router.asPath === '/products' &&
                            <Menu.Item>
                                {({ active }) => (
                                    <ProductSideModal
                                        modifier={classNames(
                                            'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2 justify-start dark:text-white ',
                                            {
                                                'bg-priBlue-200/70': active
                                            }
                                        )}
                                    />
                                )}
                            </Menu.Item>}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div >
    )
}