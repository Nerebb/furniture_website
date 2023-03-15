import classNames from 'classnames'
import { FieldInputProps, FieldMetaProps } from 'formik'
import { FormikField } from '../FormikField'

export type CustomInput = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & FormikField

export default function FormikDate({ ...props }: CustomInput) {
    return (
        <div className={classNames(
            'text-xl w-full py-1 h-fit border-b-[2.5px] font-semibold flex justify-between items-center',
            {
                'border-priBlue-500': props.meta.touched,
            }
        )}>
            <label htmlFor='birthDay' className={'translate-y-1'}>{props.label}</label>
            <input id='birthDay' type={'date'} {...props.field} className='outline-none h-fit font-semibold text-start pr-2 text-base rounded focus:ring-priBlue-500 border-none translate-y-1' />
        </div>
    )
}