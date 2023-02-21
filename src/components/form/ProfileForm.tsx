import { Gender, IUser, UserProfile } from '@types';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '../Button';
import NotFoundPage from '../NotFoundPage';
import FormikField from './FormikField';

import { UserSchemaValidate } from '@/utils/schemaValitdate';

type Props = {
    formData?: UserProfile[]
}

function ProfileForm({ formData }: Props) {
    const [isEdit, setIsEdit] = useState(false)

    if (!formData) return <NotFoundPage />

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
                setSubmitting(false);
            }}
        >
            {({ handleReset }) => (<Form className={classNames(
                "border-t border-gray-200",
                { "divide-y": isEdit }
            )}>
                {formData?.map(row => (
                    <FormikField key={row.id} type='userForm' isEdit={isEdit} id={row.id} label={row.label} content={row.content} name={row.name} />
                ))}

                {/* Button */}
                <div className={classNames(
                    'flex justify-end items-center px-4 py-5 space-x-5 rounded-b-3xl',
                    { 'bg-priBlue-100': formData && formData.length % 2 === 0 }
                )}>
                    {isEdit ?
                        <>
                            <Button text='Close edit' variant='outline' modifier='h-9 w-[125px]' onClick={() => { setIsEdit(false); handleReset() }} />
                            <Button type='submit' text='Submit' modifier='h-9 w-[125px]' >
                            </Button>
                        </>
                        :
                        <Button text="Edit profile" modifier='h-9 w-[125px]' onClick={() => setIsEdit(true)} />}
                </div>
            </Form>)}
        </Formik>
    )
}

export default ProfileForm