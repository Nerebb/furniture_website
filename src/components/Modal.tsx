import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode, useMemo, useState } from 'react'
import Button, { ButtonProps } from './Button'
import Loading from './static/Loading'
import { toast } from 'react-toastify'


type Props = {
    type?:
    | 'default'
    | 'translateX'
    btnProps?: ButtonProps
    keepOpen?: boolean
    children?: ReactNode
    title?: string
    content?: string
    dialogBtnText?: {
        accept: string,
        refuse: string,
    }
    isLoading?: boolean,
    acceptCallback?: (param?: any) => Promise<void>,
    refuseCallback?: (param?: any) => Promise<void>
}

const Modal = ({
    type = 'default',
    btnProps,
    keepOpen = false,
    children,
    title,
    content,
    dialogBtnText,
    isLoading,
    acceptCallback,
    refuseCallback,
}: Props) => {
    const [isOpen, setIsOpen] = useState(keepOpen)

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

    async function handleAccept() {
        try {
            if (acceptCallback) await acceptCallback()
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Cannot accept - Something went wrong!!!")
        }
    }

    async function handleRefuse() {
        try {
            if (refuseCallback) await refuseCallback()
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Cannot accept - Something went wrong!!!")
        }
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
                                    <Dialog.Panel className="p-5 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p- text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {title ?? "Payment successful"}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {content ?? "Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order."}
                                            </p>
                                        </div>

                                        <div className="mt-4 space-x-5 flex">
                                            <Button
                                                text={isLoading ? ("") : (dialogBtnText?.accept ?? "Accept")}
                                                onClick={handleAccept}
                                                modifier='w-full max-w-md px-5 py-1 flex-center whitespace-nowrap'
                                                variant='fill'
                                                glowModify='noAnimation'
                                                disabled={isLoading}
                                            >
                                                {isLoading &&
                                                    <Loading className='w-6 h-6 text-priBlack-200/50 fill-priBlue-500' />
                                                }
                                            </Button>
                                            <Button
                                                text={dialogBtnText?.refuse ?? "Refuse"}
                                                onClick={handleRefuse}
                                                modifier='w-full max-w-md px-5 border-red-500 border py-1 whitespace-nowrap'
                                                variant='plain'
                                                glowModify='noAnimation'
                                            />
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