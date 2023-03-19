import { FieldInputProps, FieldMetaProps } from 'formik'
import React from 'react'
import { FormikField } from '../FormikField'

export type Props = {
    field: FieldInputProps<any>
    meta: FieldMetaProps<any>
} & Omit<FormikField, 'type'>

export default function FormikPriceInput({ label, meta, field, name }: Props) {
    return (
        <input
            {...field}
            type='number'
            className='w-full rounded border-priBlack-100/50 focus:border-none focus:ring-priBlue-500 focus:ring-0.5 focus:shadow-md focus:shadow-priBlue-200 transition-all'
            placeholder={label ? label : 'priceInput'}
            inputMode='numeric'
        />
    )
}