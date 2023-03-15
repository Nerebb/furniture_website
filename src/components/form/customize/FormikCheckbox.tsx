import classNames from 'classnames'
import { Field, FieldInputProps, FieldMetaProps } from 'formik'
import { FormikField } from '../FormikField'

type Prop = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & Omit<FormikField, 'type'>

export default function FormikCheckbox({ ...props }: Prop) {
    return (
        <div className='space-x-2 flex items-center'>
            <input
                {...props.field}
                id={`${props.id}`}
                type="checkbox"
                value={props.id}
                className={classNames(
                    { 'hover:bg-priBlue-200 rounded border-priBlue-500 text-priBlue-500 focus:ring-priBlue-200 focus:ring': !props.modifyInput },
                    props.modifyInput
                )}
            />
            <label
                htmlFor={`${props.id}`}
                className={classNames(
                    'capitalize',
                    props.modifyLabel
                )}
            >
                {props.label}
            </label>
        </div>
    )
}