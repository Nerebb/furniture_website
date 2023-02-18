import React, { useMemo } from 'react'
import Button from './Button'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import NotFoundPage from './NotFoundPage'
import Image from 'next/image'
import { Field, FieldMetaProps, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import classNames from 'classnames'
import { IUser } from '@types'
import * as Yup from 'yup';
import { CubeIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'
import { BASE_URL } from '@/utils/envVariables'


type Props = {
    btnText?: string
    btnModify?: React.HTMLProps<HTMLElement>["className"]
    type?:
    | 'Default'
    | 'login'
}

interface IRegiser {
    name: IUser['name']
    email: IUser['email']
    password: IUser['password']
}

const validationSchema = {
    name: Yup.string().lowercase().max(10, 'Must lesser than 10 characters').required("Name field missing"),
    email: Yup.string().email().typeError("Invalid email").required("email field missing"),
    password: Yup.string().max(20, 'MustLesser than 20 characters').required('password field missing'),
}

const inputStyle = classNames(
    'ml-2 py-3 border-b-[2px]',
    // Animation
    ' transition-color duration-300 border-priBlack-500 focus:outline-none hover:border-priBlue-200 group'
)


export default function Modal({ btnText, btnModify, type = 'login' }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    console.log("GOOGLE_ID", process.env.GOOGLE_ID)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function handleGoogleSignIn() {
        signIn('google', { callbackUrl: BASE_URL })
    }

    function handleError(id: any, meta: FieldMetaProps<any>) {
        if (!meta.touched) return
        if (meta.touched && meta.error) toast.error(meta.error, { toastId: meta.error });
    }

    async function handleSubmit(values: IRegiser, { setSubmitting, resetForm }: FormikHelpers<IRegiser>) {
        await new Promise(r => setTimeout(r, 500));
        console.log("🚀 ~ file: AccProfile.tsx:120 ~ AccProfile ~ values", values)
        setSubmitting(false);
        resetForm()
        toast.success('Account created', { toastId: "NewAcc" })
    }

    function renderType() {
        switch (type) {
            case 'login':
                return (
                    <Dialog.Panel className="w-full xl:w-[1400px] transform overflow-hidden rounded-br-4xl bg-white p-2 text-left align-middle shadow-xl transition-all flex" >
                        {/* Login */}
                        <Dialog.Title
                            as='div'
                            className={'grow my-auto p-24'}
                        >
                            {/* Title */}
                            <div className='text-3xl font-semibold space-y-5 mb-5'>
                                <h2 className='mb-14 flex gap-2 items-center'><CubeIcon className='w-8 h-8' /><span>Nereb</span></h2>
                                <h1>Create an account</h1>
                                <p className='text-xl font-normal whitespace-nowrap'>Let{"\'"}s get started with your 30 day free trial.</p>
                            </div>
                            {/* Formik */}
                            <Formik
                                initialValues={{
                                    name: "",
                                    email: "",
                                    password: '',
                                }}
                                validationSchema={Yup.object(validationSchema)}
                                onSubmit={handleSubmit}
                            >
                                {({ handleReset }) => (
                                    <Form className={classNames(
                                        'flex flex-col space-y-8'
                                    )}>
                                        <Field name="name">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                meta,
                                            }: FieldProps) => (
                                                <label htmlFor='name' className={classNames(
                                                    'ml-2 py-3 border-b-[2px] font-semibold flex',
                                                    // Animation
                                                    'transition duration-300 focus:outline-none',
                                                    meta.touched && meta.error ? "border-red-500" : "border-priBlack-500 hover:border-priBlue-500",

                                                )}>Name
                                                    <>
                                                        <input id='name' className='ml-2 outline-none font-normal grow' type="text" placeholder="Account name" {...field} />
                                                        {handleError("name", meta)}
                                                    </>
                                                </label>
                                            )}
                                        </Field>

                                        <Field name="password">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                meta,
                                            }: FieldProps) => (
                                                <label htmlFor='password' className={classNames(
                                                    'ml-2 py-3 border-b-[2px] font-semibold flex',
                                                    // Animation
                                                    ' transition-color duration-300  focus:outline-none ',
                                                    meta.touched && meta.error ? "border-red-500" : "border-priBlack-500 hover:border-priBlue-500",

                                                )}>Password
                                                    <>
                                                        <input id='password' className='ml-2 outline-none font-normal grow' type="password" placeholder="Account password" {...field} />
                                                        {handleError("password", meta)}
                                                    </>
                                                </label>
                                            )}
                                        </Field>

                                        <Field name="confirmPassword">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                meta,
                                            }: FieldProps) => (
                                                <label htmlFor='confirmPassword' className={classNames(
                                                    'ml-2 py-3 border-b-[2px] font-semibold flex',
                                                    // Animation
                                                    ' transition-color duration-300  focus:outline-none ',
                                                    meta.touched && meta.error ? "border-red-500" : "border-priBlack-500 hover:border-priBlue-500",

                                                )}>Confirm password
                                                    <>
                                                        <input id='confirmPassword' className='ml-2 outline-none font-normal grow' type="confirmPassword" placeholder="Confirm password" {...field} />
                                                        {handleError("confirmPassword", meta)}
                                                    </>
                                                </label>
                                            )}
                                        </Field>

                                        <Field name="email">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                meta,
                                            }: FieldProps) => (
                                                <label htmlFor='email' className={classNames(
                                                    'ml-2 py-3 border-b-[2px] font-semibold flex',
                                                    // Animation
                                                    ' transition-color duration-300  focus:outline-none ',
                                                    meta.touched && meta.error ? "border-red-500" : "border-priBlack-500 hover:border-priBlue-500",

                                                )}>Email
                                                    <>
                                                        <input id='email' className='ml-2 outline-none font-normal grow' type="email" placeholder="Account email" {...field} />
                                                        {handleError("email", meta)}
                                                    </>
                                                </label>
                                            )}
                                        </Field>

                                        <Field name="gender">
                                            {({
                                                field, // { name, value, onChange, onBlur }
                                                meta,
                                            }: FieldProps) => (
                                                <label htmlFor='gender' className={classNames(
                                                    'ml-2 py-3 border-b-[2px] font-semibold flex',
                                                    // Animation
                                                    ' transition-color duration-300  focus:outline-none ',
                                                    meta.touched && meta.error ? "border-red-500" : "border-priBlack-500 hover:border-priBlue-500",

                                                )}>Gender
                                                    <select className='outline-none grow font-normal' id='gender' {...field}>
                                                        <option defaultValue='' disabled>Select your gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="others">others</option>
                                                    </select>
                                                </label>
                                            )}
                                        </Field>


                                        {/* Button - sub */}
                                        <article className={classNames(
                                            'space-y-5'
                                        )}>
                                            <Button text='Create an account' type='submit' modifier='w-full flex justify-center py-4 gap-2 text-xl' />
                                            <Button text='Signup with google' modifier='w-full flex justify-center py-4 gap-2 text-xl' variant='outline'
                                                onClick={handleGoogleSignIn}
                                            >
                                                {/* GoogleSVG */}
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                                            </Button>
                                            <Button text='Signup with facebook' modifier='w-full flex justify-center py-4 gap-2 text-xl' variant='outline'>
                                                {/* FacebookSVG */}
                                                <div className='flex justify-center items-center bg-priBlue-600 rounded-sm w-8 h-8 p-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#fff" height="24" width="24" version="1.1" viewBox="0 0 310 310" xmlSpace="preserve">
                                                        <g id="XMLID_834_">
                                                            <path id="XMLID_835_" d="M81.703,165.106h33.981V305c0,2.762,2.238,5,5,5h57.616c2.762,0,5-2.238,5-5V165.765h39.064   c2.54,0,4.677-1.906,4.967-4.429l5.933-51.502c0.163-1.417-0.286-2.836-1.234-3.899c-0.949-1.064-2.307-1.673-3.732-1.673h-44.996   V71.978c0-9.732,5.24-14.667,15.576-14.667c1.473,0,29.42,0,29.42,0c2.762,0,5-2.239,5-5V5.037c0-2.762-2.238-5-5-5h-40.545   C187.467,0.023,186.832,0,185.896,0c-7.035,0-31.488,1.381-50.804,19.151c-21.402,19.692-18.427,43.27-17.716,47.358v37.752H81.703   c-2.762,0-5,2.238-5,5v50.844C76.703,162.867,78.941,165.106,81.703,165.106z" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </Button>
                                        </article>
                                    </Form>)}
                            </Formik>

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
            case 'Default':
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

            default:
                return <NotFoundPage />
        }
    }

    return (
        <article>
            {/* display */}
            <Button text={btnText} onClick={openModal} modifier={btnModify} />

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
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                {renderType()}
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </article>
    )
}