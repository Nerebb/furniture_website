
import { FormRow } from '@types';
import { useField } from 'formik';
import { HTMLInputTypeAttribute } from 'react';
import FormikCheckbox from './customize/FormikCheckbox';
import FormikDate from './customize/FormikDate';
import FormikInput from './customize/FormikInput';
import FormikPass from './customize/FormikPass';
import FormikPriceInput from './customize/FormikPriceInput';
import FormikSelect from './customize/FormikSelect';

export interface FormikField extends FormRow {
    type?:
    | HTMLInputTypeAttribute
    | 'select'
    | 'priceInput'
    isEdit?: boolean
    modifyLabel?: string,
    modifyInput?: string,
}

export default function FormikField({ type, modifyLabel, modifyInput, isEdit, ...props }: FormikField) {
    const [field, meta] = useField(props.name);

    switch (type) {
        case 'priceInput':
            return (
                <FormikPriceInput
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
        case 'checkbox':
            return (
                <FormikCheckbox
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
        case 'password':
            return (
                <FormikPass
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
        case 'date':
            return (
                <FormikDate
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
        case 'select':
            return (
                <FormikSelect
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
        default:
            return (
                <FormikInput
                    type={type as HTMLInputTypeAttribute}
                    field={field}
                    meta={meta}
                    {...props}
                />
            )
    }

}