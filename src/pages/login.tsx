import Modal from '@/components/Modal'
import BlankLayout from '@/layouts/BlankLayout'
import React from 'react'

type Props = {}

export default function login({ }: Props) {
    return (
        <BlankLayout>
            <Modal formType='moreInfo' keepOpen={true} />
        </BlankLayout>
    )
}