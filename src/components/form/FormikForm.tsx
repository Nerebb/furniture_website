import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react'
import { Gender, IRegiser, IUser } from '@types';
import * as Yup from 'yup'
import Button from '../Button';
import NotFoundPage from '../NotFoundPage';
import FormikField from './FormikField';

export type IUserProfile = {
    id: number,
    label: string,
    name: string,
    content: any,
}

type Props = {
    type:
    | 'register'
    | 'profile'
    userProfile: IUserProfile[]
}

const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/


const UserSchemaValidate = {
    name: Yup.string().lowercase().max(10, 'Must lesser than 10 characters'),
    nickName: Yup.string().lowercase().max(10, "Must lesser than 10 characters"),
    address: Yup.string().lowercase().max(50, "Must lesser than 10 characters"),
    email: Yup.string().email().typeError("Invalid email"),
    gender: Yup.string().lowercase().oneOf(['male', 'female', 'others'], "Allowed field: male, female, others"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Invalid phone number"),
    birthDay: Yup.string().typeError("Invalid date"),
}

export default function FormikForm({ userProfile, type = 'profile' }: Props) {
    const [isEdit, setIsEdit] = useState(false)
    switch (type) {
        case 'register':
            return (
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: '',
                        phoneNumber: NaN,
                    }}
                    validationSchema={Yup.object(UserSchemaValidate)}
                    onSubmit={async (values, { setSubmitting }: FormikHelpers<IRegiser>) => {
                        await new Promise(r => setTimeout(r, 500));
                        console.log("🚀 ~ file: AccProfile.tsx:120 ~ AccProfile ~ values", values)
                        setSubmitting(false);
                    }}
                >
                    {({ handleReset }) => (
                        <Form className={classNames(

                        )}>
                            {/*  */}


                            {/* Button - sub */}
                            <article className={classNames(

                            )}>

                            </article>
                        </Form>)}
                </Formik>
            )

        case "profile":
            return (
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
                    validationSchema={Yup.object(UserSchemaValidate)}
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
                            <FormikField key={row.id} id={row.id} label={row.label} content={row.content} name={row.name} />
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
            )
        default:
            return <NotFoundPage />
    }
}