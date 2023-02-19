import { IUser } from '@types'
import Card from '../../Card'
import React, { useState } from 'react'
import * as Yup from 'yup';
import FormikForm, { IUserProfile } from '@/components/form/FormikForm'

type Props = {
    userData: IUser
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

    return (
        <Card modify='h-fit max-w-[820px] mx-auto p-5'>
            {/* Title */}
            <article className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
            </article>

            {/* Main */}
            <FormikForm type='profile' formData={userProfile} />

        </Card>
    )
}
