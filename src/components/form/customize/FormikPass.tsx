import classNames from 'classnames'
import { FieldInputProps, FieldMetaProps } from 'formik'
import { useState } from 'react'
import { FormikField } from '../FormikField'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export type CustomInput = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & Omit<FormikField, 'type'>

export default function FormikPass({ ...props }: CustomInput) {
    const [showPass, setShowPass] = useState<boolean>(false)
    return (
        <div className={classNames(
            'relative text-xl py-1 w-full h-fit border-b-[2.5px] font-semibold',
            {
                'border-red-500': props.meta.touched && props.meta.error,
                'border-priBlue-500': props.meta.value && !props.meta.error,
            }
        )}>
            <input id={props.name} type={showPass ? 'text' : 'password'} {...props.field} name={props.name}
                className={classNames(
                    props.modifyInput,
                    'peer w-full font-normal outline-none py-1 focus:text-priBlue-500 border-none focus:ring-priBlue-500 rounded',
                    { '': props.meta.error }
                )} />
            <label htmlFor={props.name} className={
                classNames(
                    props.modifyLabel,
                    'absolute left-0 bottom-1 peer-focus:-translate-y-8 peer-focus:text-base transition-all duration-300',
                    {
                        '-translate-y-8 text-base': props.meta.value,
                    }
                )
            }>{props.label}
            </label>

            {props.meta.touched && props.meta.error && <span className={classNames(
                'absolute right-0 bottom-2 text-base text-red-600 peer-focus:-translate-y-8 peer-focus:text-base transition-all duration-300',
                {
                    '-translate-y-8': props.meta.value,
                }
            )}>{props.meta.error}</span>}

            <span className={classNames(
                'w-6 h-6 absolute right-1 bottom-2 opacity-0 transition-opacity duration-500',
                {
                    'opacity-100': props.meta.value
                }
            )}
                onClick={() => setShowPass(!showPass)}
            >
                {!showPass ? <EyeIcon /> : <EyeSlashIcon />}
            </span>
        </div>
    )
}