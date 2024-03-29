import axios, { allowedField } from '@/libs/axiosApi';
import { Gender } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormRow } from '@types';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Button';
import Loading from '../static/Loading';
import { UserSchemaValidate } from '@/libs/schemaValitdate';
import * as Yup from 'yup'
import dateFormat from '@/libs/utils/dateFormat';

type userField = {
    type?: FormRow['inputType']
    idx: number,
    isEdit: boolean,
} & FormRow

function UserField({ type = 'text', isEdit, ...props }: userField) {
    const [field, meta] = useField(props.name);

    let displayContent: string | undefined;
    if (type === 'date' && meta.value && field.value) {
        displayContent = dateFormat(meta.value)
        meta.value = dateFormat(meta.value, 'yyyy-MM-dd') //Actual value type
        field.value = dateFormat(field.value, 'yyyy-MM-dd') //Showed value
    } else {
        displayContent = field.value
    }
    return (
        <div className={classNames(
            "px-4 h-[70px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center",
            props.idx % 2 === 0 && !isEdit ? "bg-priBlue-100 dark:bg-priBlack-700/80" : "",
        )}>
            <label htmlFor={props.name} className="text-sm font-medium text-gray-900 dark:text-white">
                <p>{props.label}</p>
                {isEdit && meta.touched && meta.error ? <span className='text-sm text-red-600'>{meta.error}</span> : ""}
            </label>
            {isEdit ? (
                type === 'select' ? (
                    <select
                        className={classNames(
                            'w-full capitalize sm:px-3 h-[calc(100%-1em)] col-span-2 shadow-md rounded-md border-b-2 transition-all duration-150 border-priBlue-400 focus:ring-0 outline-none focus:border-priBlue-400',
                            "dark:bg-priBlack-400/50 dark:text-white dark:border-white"
                        )}
                        id='gender'
                        {...field}>
                        <option defaultValue='' disabled>Select your {`${props.name}`}</option>
                        {Object.values(Gender).map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                    </select>
                ) : (
                    <input type={type} {...field} name={props.name} className={classNames(
                        "w-full sm:px-3 h-[calc(100%-1em)] col-span-2 shadow-md rounded-md border-b-2 transition-all duration-150 focus:ring-0 focus:border-priBlue-400 outline-none",
                        "dark:bg-priBlack-400/80 dark:text-white dark:border-white",
                        meta.touched && meta.error ? "border-red-500" : 'border-priBlue-400',
                        { 'noSpin': type === 'number' }
                    )} />
                )
            ) : (
                displayContent &&
                <p
                    className="mt-1 capitalize sm:pl-3 text-sm text-gray-500 sm:col-span-2 sm:mt-0 dark:text-white"
                >
                    {displayContent}
                </p>
            )}
        </div>
    )
}

function ProfileForm() {
    const { data: session } = useSession()
    const [isEdit, setIsEdit] = useState(false)
    const queryClient = useQueryClient();

    const { isLoading, isError, data: userProfile } = useQuery({
        queryKey: ['userProfile', session?.id],
        queryFn: () => axios.getUser(session?.id),
        enabled: !!session?.id,
    })

    const { mutate } = useMutation({
        mutationKey: ['updateProfile', session?.id],
        mutationFn: (data: allowedField): Promise<{ message: String }> => axios.updateUser(data, session?.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['userProfile', session?.id])
            toast.success('Update profile completed')
            setIsEdit(false)
        }
    })

    if (isLoading || isError) return (
        <div className='w-full h-full flex-center'>
            <Loading />
        </div>
    )

    const profileRow: FormRow[] = [
        { id: 0, label: "Full name", inputType: 'text', name: 'name', content: userProfile?.name },
        { id: 1, label: "Nick name", inputType: 'text', name: 'nickName', content: userProfile?.nickName },
        { id: 2, label: "Email", name: 'email', inputType: 'email', content: userProfile?.email },
        { id: 3, label: "Address", inputType: 'text', name: 'address', content: userProfile?.address },
        { id: 4, label: "Gender", inputType: 'select', name: 'gender', content: userProfile?.gender },
        { id: 5, label: "Phone number", inputType: 'number', name: 'phoneNumber', content: userProfile?.phoneNumber },
        { id: 6, label: "Birthday", inputType: 'date', name: 'birthDay', content: userProfile?.birthDay },
    ]

    const initValue: allowedField = {
        name: userProfile?.name,
        nickName: userProfile?.nickName,
        email: userProfile?.email,
        address: userProfile?.address,
        gender: userProfile!.gender,
        phoneNumber: userProfile?.phoneNumber,
        birthDay: userProfile?.birthDay,
    }

    async function handleSubmit(values: allowedField, { setSubmitting, }: FormikHelpers<allowedField>) {
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 500)); //Debounce

        try {
            mutate(values)
            setSubmitting(false)
        } catch (error) {
            console.log(error)
            toast.error("Unknow error, please try again!")
            setSubmitting(false)
        }

        setSubmitting(false);
    }

    return (
        <Formik
            initialValues={initValue}
            validationSchema={Yup.object(UserSchemaValidate)}
            onSubmit={handleSubmit}
        >
            {({ handleReset, isSubmitting, dirty }) => (<Form className={classNames(
                "border-t border-gray-200",
                { "divide-y": isEdit }
            )}>
                {profileRow?.map((row, idx) => (
                    <UserField
                        key={row.id}
                        isEdit={isEdit}
                        idx={idx}
                        id={row.id}
                        type={row.inputType}
                        label={row.label}
                        content={row.content}
                        name={row.name}
                    />
                ))}
                {/* Button */}
                <div className={classNames(
                    'flex justify-end items-center px-4 py-5 space-x-5 rounded-b-3xl',
                    { 'bg-priBlue-100': profileRow && profileRow.length % 2 === 0 }
                )}>
                    {isEdit ?
                        <>
                            <Button text='Close edit' variant='outline' modifier='h-9 w-[125px] dark:text-white' onClick={() => { setIsEdit(false); handleReset() }} />
                            <Button type='submit' text={isSubmitting ? '' : 'Submit'} modifier='h-9 w-[125px] dark:text-white' disabled={!dirty}>
                                {isSubmitting &&
                                    <div className='h-full w-full flex-center'>
                                        <Loading className='w-5 h-5 text-gray-200 dark:text-white fill-priBlue-500' />
                                    </div>
                                }
                            </Button>
                        </>
                        :
                        <Button text="Edit profile" modifier='h-9 w-[125px] dark:text-white' onClick={() => setIsEdit(true)} />}
                </div>
            </Form>)}
        </Formik>
    )
}

export default ProfileForm