import classNames from 'classnames';
import { useField } from 'formik';
import React from 'react'
import { IUserProfile } from './FormikForm';

interface Props extends IUserProfile {
    isEdit?: boolean
}

export default function FormikField({ id, label, content, isEdit, ...props }: Props) {
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