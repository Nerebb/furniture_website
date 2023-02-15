import NotFoundPage from '@/components/NotFoundPage'
import { AccPage } from '@/components/SideMenu'
import SideMenuLayout from '@/layouts/SideMenuLayout'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

export default function AccountPage({ }: Props) {
    const router = useRouter()
    const render = AccPage.find(i => i.href === router.asPath)?.element
    return (
        <SideMenuLayout>
            {render ? render : <NotFoundPage />}
        </SideMenuLayout>
    )
}