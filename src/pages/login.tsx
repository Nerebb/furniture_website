import AssignForm from '@/components/form/AssignForm'
import Modal from '@/components/Modal'
import BlankLayout from '@/layouts/BlankLayout'
import React from 'react'

type Props = {}

export default function login({ }: Props) {
    return (
        <BlankLayout>
            <AssignForm type='login' keepOpen={true} />
        </BlankLayout>
    )
}