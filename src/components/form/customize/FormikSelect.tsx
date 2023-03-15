import classNames from 'classnames'
import { FieldInputProps, FieldMetaProps } from 'formik'
import { FormikField } from '../FormikField'

export type CustomInput = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & Omit<FormikField, 'type'>

export default function FormikSelect({ ...props }: CustomInput) {
    return (
        <div className={classNames(
            'text-xl w-full py-1 h-fit border-b-[2.5px] font-semibold flex justify-between items-center',
            {
                'border-priBlue-500': props.meta.touched,
            }
        )}>
            <label htmlFor='gender' className={'translate-y-1'}>{props.label}</label>
            <select className='outline-none h-fit font-semibold pr-2 capitalize text-base border-none rounded focus:ring-priBlue-500 translate-y-1' id='gender' {...props.field}>
                <option defaultValue='' disabled>Select your {`${props.name}`}</option>
                {Array.isArray(props.content) &&
                    props.content.map((i) => (
                        <option key={i}>{i}</option>
                    ))}
            </select>
        </div>
    )
}