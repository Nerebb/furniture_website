import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useField } from 'formik';
import React, { HTMLInputTypeAttribute, useState } from 'react'
import NotFoundPage from '../NotFoundPage';
import { IUserProfile } from './FormikForm';

interface Props extends IUserProfile {
    type?:
    | HTMLInputTypeAttribute
    | 'userForm'
    | 'select'
    isEdit?: boolean
    modifyLabel?: string,
    modifyInput?: string,
}



export default function FormikField({ type, modifyLabel, modifyInput, isEdit, ...props }: Props) {
    const [field, meta] = useField(props.name);
    const [showPass, setShowPass] = useState<boolean>(false)

    const defaultRows =
        <div className={classNames(
            'relative text-xl w-full py-1 h-fit border-b-[2.5px] font-semibold',
            { 'border-red-500': meta.touched && meta.error }
        )}>
            <input id={props.name} type={type} {...field} name={props.name}
                className={classNames(
                    modifyInput,
                    'peer font-normal outline-none focus:text-priBlue-500',
                    { '': meta.error }
                )} />
            <label htmlFor={props.name} className={
                classNames(
                    modifyLabel,
                    'absolute left-0 peer-focus:-translate-y-6 peer-focus:text-base transition-all duration-300',
                    {
                        '-translate-y-6 text-base font-normal': meta.value,
                    }
                )
            }>{props.label}
            </label>

            {meta.touched && meta.error && <span className={classNames(
                'absolute right-0 translate-y-[3px] text-base text-red-600 peer-focus:-translate-y-6 peer-focus:text-base transition-all duration-300',
                {
                    '-translate-y-6': meta.value,
                }
            )}>{meta.error}</span>}
        </div>

    switch (type) {
        case 'userForm':
            return (
                <>
                    <div className={classNames(
                        "px-4 h-[70px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center",
                        props.id % 2 === 0 && !isEdit ? "bg-priBlue-100" : "",
                    )}>
                        <label htmlFor={props.name} className="text-sm font-medium text-gray-900">
                            <p>{props.label}</p>
                            {meta.touched && meta.error ? <span className='text-sm text-red-600'>{meta.error}</span> : ""}
                        </label>
                        {isEdit ? (
                            <input {...field} name={props.name} className={classNames(
                                "w-full sm:pl-3 h-[calc(100%-1em)] col-span-2 shadow-md rounded-md border-b-2 transition-all duration-150 border-priBlue-400 focus:outline focus:outline-1 outline-priBlue-200 focus:border-none",
                                { "border-red-500 focus:outline-red-500": meta.touched && meta.error }
                            )} />
                        ) : (
                            <p className="mt-1 sm:pl-3 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{props.content}</p>
                        )}
                    </div>
                </>
            )
        case 'password':
            return (
                <div className={classNames(
                    'relative text-xl py-1 w-full h-fit border-b-[2.5px] font-semibold',
                    { 'border-red-500': meta.touched && meta.error }
                )}>
                    <input id={props.name} type={showPass ? 'text' : 'password'} {...field} name={props.name}
                        className={classNames(
                            modifyInput,
                            'peer font-normal outline-none focus:text-priBlue-500',
                            { '': meta.error }
                        )} />
                    <label htmlFor={props.name} className={
                        classNames(
                            modifyLabel,
                            'absolute left-0 peer-focus:-translate-y-6 peer-focus:text-base transition-all duration-300',
                            {
                                '-translate-y-6 text-base font-normal': meta.value,
                            }
                        )
                    }>{props.label}
                    </label>

                    {meta.touched && meta.error && <span className={classNames(
                        'absolute right-0 text-base text-red-600 peer-focus:-translate-y-6 peer-focus:text-base transition-all duration-300',
                        {
                            '-translate-y-6': meta.value,
                        }
                    )}>{meta.error}</span>}

                    <span className={classNames(
                        'w-6 h-6 absolute right-0 opacity-0 transition-opacity duration-500',
                        {
                            'opacity-100': meta.value
                        }
                    )}
                        onClick={() => setShowPass(!showPass)}
                    >
                        {!showPass ? <EyeIcon /> : <EyeSlashIcon />}
                    </span>
                </div>
            )
        case 'select':
            return (
                <div className='text-xl w-full py-1 h-fit border-b-[2.5px] font-semibold flex justify-between items-center'>
                    <label htmlFor='gender h-fit' className={''}>{props.label}</label>
                    <select className='outline-none h-fit font-normal text-end pr-2 capitalize text-base' id='gender' {...field}>
                        <option defaultValue='' disabled>Select your {`${props.name}`}</option>
                        {Array.isArray(props.content) &&
                            props.content.map((i) => (
                                <option key={i}>{i}</option>
                            ))}
                    </select>
                </div>
            )
        default:
            return defaultRows
    }
}