import classNames from 'classnames'
import { FieldInputProps, FieldMetaProps } from 'formik'
import { FormikField } from '../FormikField'

type Prop = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & Omit<FormikField, 'type'>

export default function FormikCheckbox({ ...props }: Prop) {
    return (
        <label htmlFor={`${props.field.name}-${props.id}`} className='space-x-2 flex items-center dark:text-white'>
            <input
                {...props.field}
                id={`${props.field.name}-${props.id}`}
                type="checkbox"
                value={props.id}
                className={classNames(
                    { 'hover:bg-priBlue-200 rounded border-priBlue-500 text-priBlue-500 focus:ring-priBlue-200 focus:ring-1': !props.modifyInput },
                    props.modifyInput
                )}
            />
            <p
                className={classNames(
                    'capitalize',
                    props.modifyLabel
                )}
            >
                {props.label}
            </p>
        </label>
    )
}