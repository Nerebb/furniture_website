import classNames from 'classnames'
import { FieldInputProps, FieldMetaProps } from 'formik'
import { FormikField } from '../FormikField'

export type CustomInput = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & FormikField

export default function FormikInput({ ...props }: CustomInput) {
    return (
        <div className={classNames(
            'relative text-xl w-full py-1 h-fit border-b-[2.5px] font-semibold',
            {
                'border-red-500': props.meta.touched && props.meta.error,
                'border-priBlue-500': props.meta.value && !props.meta.error,
                'noSpin': props.type === 'number'
            }
        )}>
            <input id={props.name}
                {...props.field}
                type={props.type}
                name={props.name}
                inputMode={props.type === 'number' ? 'numeric' : 'none'}
                className={classNames(
                    props.modifyInput,
                    'peer w-full font-normal outline-none py-1 focus:text-priBlue-500 border-none bg-white focus:ring-priBlue-500 rounded',
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
                'absolute first-letter:capitalize right-0 bottom-2 text-base text-red-600 peer-focus:-translate-y-8 peer-focus:text-base transition-all duration-300',
                props.meta.value ? '-translate-y-8' : 'translate-y-[3px]',
            )}>{props.meta.error}</span>}
        </div>
    )
}