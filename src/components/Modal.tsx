import { Dialog, Transition } from '@headlessui/react'
import { CubeIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import Button, { ButtonProps } from './Button'
import AssignForm, { TFormProps } from './form/AssignForm'


type Props = {
    btnProps?: ButtonProps
    type?:
    | 'default'
    | 'form'
    formType?: TFormProps['type']
    keepOpen?: boolean
}

const Modal = ({ btnProps, keepOpen = false, formType, type = 'default' }: Props) => {
    const [isOpen, setIsOpen] = useState(keepOpen ? true : false)

    function closeModal() {
        if (keepOpen) return
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function renderForm() {
        if (formType) type = 'form'
        switch (type) {
            case 'form':
                return (
                    <Dialog.Panel className="w-full xl:w-[1400px] h- transform overflow-hidden rounded-br-4xl bg-white p-2 text-left align-middle shadow-xl transition-all flex" >
                        {/* Login */}
                        <Dialog.Title
                            as='div'
                            className={'grow my-auto p-24'}
                        >
                            {/* Title */}
                            <div className='text-3xl font-semibold space-y-5 mb-10'>
                                <h2 className='mb-14 flex gap-2 items-center'><CubeIcon className='w-8 h-8' /><span>Nereb</span></h2>
                                <h1>Create an account</h1>
                                <p className='text-xl font-normal whitespace-nowrap'>Let{"\'"}s get started with your 30 day free trial.</p>
                            </div>
                            {/* Formik */}
                            <AssignForm type={formType ? formType : 'register'} />

                            {/* Other methods */}
                        </Dialog.Title>

                        {/*LoginImg */}
                        <Dialog.Description
                            as='div'
                            className={'relative w-3/5 aspect-square group'}
                        >
                            <Image className='rounded-tl-4xl rounded-br-4xl' alt='' src={'/images/OliverSofa_RS.jpg'} fill />
                            <div className='absolute bottom-0 px-5 text-xl bg-priBlue-100/40 rounded-br-4xl transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
                                <h1 className='mb-5'>
                                    {"\""}Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry{'\''}s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.{"\""}
                                </h1>

                                <p className='text-md'>Nereb</p>
                                <p className='mb-2 text-sm'>User position</p>
                            </div>
                        </Dialog.Description>
                    </Dialog.Panel>
                )
            case 'default':
                return (
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
                )
        }
    }

    return (
        <article>
            {/* display */}
            <Button onClick={openModal} {...btnProps} />

            {/* Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                {renderForm()}
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </article>
    )
}

export default Modal