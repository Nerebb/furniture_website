import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode, useMemo, useState } from 'react'
import Button, { ButtonProps } from './Button'


type Props = {
    type?:
    | 'default'
    | 'translateX'
    btnProps?: ButtonProps
    keepOpen?: boolean
    children?: ReactNode
}

const Modal = ({ type = 'default', btnProps, keepOpen = false, children }: Props) => {
    const [isOpen, setIsOpen] = useState(keepOpen ? true : false)

    const ContentTransition = useMemo(() => {
        switch (type) {
            case 'translateX':
                return {
                    enter: 'transform transition ease-in-out duration-500 sm:duration-700',
                    enterFrom: 'translate-x-1/2',
                    enterTo: 'translate-x-0',
                    leave: 'transform transition ease-in-out duration-500 sm:duration-700',
                    leaveFrom: 'translate-x-0',
                    leaveTo: 'translate-x-full'
                }
            default:
                return {
                    enter: "ease-out duration-300",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "ease-in duration-200",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0",
                }
        }
    }, [type])

    function closeModal() {
        if (keepOpen) return
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <article>
            {/* display */}
            <Button onClick={openModal} {...btnProps} />

            {/* Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    {/* Background */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-1" />
                    </Transition.Child>

                    {/* Content */}
                    <div className="fixed inset-0 overflow-y-auto customScrollbar">
                        <div className={classNames(
                            {
                                'flex-center min-h-full p-4 text-center': type === 'default',
                                'min-h-full flex justify-end': type === 'translateX'
                            }
                        )}>
                            <Transition.Child
                                {...ContentTransition}
                            >
                                {children ? children : (
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p- text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Payment successful
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Your payment has been successfully submitted. We’ve sent
                                                you an email with all of the details of your order.
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Got it, thanks!
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                )}
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </article>
    )
}

export default Modal