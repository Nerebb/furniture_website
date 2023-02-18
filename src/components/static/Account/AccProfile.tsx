import { Gender, IUser } from '@types'
import Button from '../../Button'
import Card from '../../Card'
import React, { useState } from 'react'
import classNames from 'classnames'
import { Formik, Field, Form, FormikHelpers, useField } from 'formik';
import * as Yup from 'yup';

type Props = {
    userData: IUser
}

type IUserProfile = {
    id: number,
    label: string,
    name: string,
    content: any,
}

const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

const validationSchema = {
    name: Yup.string().lowercase().max(20, 'Must lesser than 10 characters'),
    nickName: Yup.string().lowercase().max(10, "Must lesser than 10 characters"),
    address: Yup.string().lowercase().max(50, "Must lesser than 10 characters"),
    email: Yup.string().email().typeError("Invalid email"),
    gender: Yup.string().lowercase().oneOf(['male', 'female', 'others'], "Allowed field: male, female, others"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Invalid phone number"),
    birthDay: Yup.string().typeError("Invalid date"),
}

export default function AccProfile({ userData }: Props) {
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const userProfile = [
        { id: 0, label: "Full name", name: 'name', content: userData?.name },
        { id: 1, label: "Nick name", name: 'nickName', content: userData?.nickName },
        { id: 2, label: "Address", name: 'address', content: userData?.address },
        { id: 3, label: "Gender", name: 'gender', content: userData?.gender },
        { id: 4, label: "Phone number", name: 'phoneNumber', content: userData?.phoneNumber },
        { id: 5, label: "Birthday", name: 'birthDay', content: userData?.birthDay },
    ]
    function CustomRow({ id, label, content, ...props }: IUserProfile) {
        const [field, meta] = useField(props);
        return (
            <>
                <div className={classNames(
                    "px-4 h-[70px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center",
                    id % 2 === 0 && !isEdit ? "bg-priBlue-100" : "",
                )}>
                    <label htmlFor={props.name} className="text-sm font-medium text-gray-900">
                        <p>{label}</p>
                        {meta.touched && meta.error ? <span className='text-sm text-red-600'>{meta.error}</span> : ""}
                    </label>
                    {isEdit ? (
                        <input {...field} {...props} className={classNames(
                            "w-full sm:pl-3 h-[calc(100%-1em)] col-span-2 shadow-md rounded-md border-b-2 transition-all duration-150 border-priBlue-400 focus:outline focus:outline-1 outline-priBlue-200 focus:border-none",
                            { "border-red-500 focus:outline-red-500": meta.touched && meta.error }
                        )} />
                    ) : (
                        <p className="mt-1 sm:pl-3 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{content}</p>
                    )}
                </div>
            </>
        )
    }

    return (
        <Card modify='h-fit max-w-[820px] mx-auto p-5'>
            {/* Title */}
            <article className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
            </article>

            {/* Main */}
            <Formik
                initialValues={{
                    name: "Nereb",
                    nickName: "render",
                    password: "test12345",
                    address: "test distric 2 loreisum",
                    email: "test@gmail.com",
                    gender: Gender.others,
                    phoneNumber: 1032423,
                    birthDay: "27/04/1996",
                }}
                validationSchema={Yup.object(validationSchema)}
                onSubmit={async (values, { setSubmitting }: FormikHelpers<IUser>) => {
                    await new Promise(r => setTimeout(r, 500));
                    console.log("🚀 ~ file: AccProfile.tsx:120 ~ AccProfile ~ values", values)
                    setSubmitting(false);
                }}
            >
                {({ handleReset }) => (<Form className={classNames(
                    "border-t border-gray-200",
                    { "divide-y": isEdit }
                )}>
                    {userProfile.map(row => (
                        <CustomRow key={row.id} id={row.id} label={row.label} content={row.content} name={row.name} />
                    ))}

                    {/* Button */}
                    <article className={classNames(
                        'flex justify-end items-center px-4 py-5 space-x-5 rounded-b-3xl',
                        { 'bg-priBlue-100': userProfile.length % 2 === 0 }
                    )}>
                        {isEdit ?
                            <>
                                <Button text='Close edit' variant='outline' modifier='h-9 w-[125px]' onClick={() => { setIsEdit(false); handleReset() }} />
                                <Button type='submit' text='Submit' modifier='h-9 w-[125px]' >
                                </Button>
                            </>
                            :
                            <Button text="Edit profile" modifier='h-9 w-[125px]' onClick={() => setIsEdit(true)} />}
                    </article>
                </Form>)}
            </Formik>
        </Card>
    )
}
