import NotFoundPage from '@/components/NotFoundPage'
import { AccPage } from '@/components/SideMenu'
import SideMenuLayout from '@/layouts/SideMenuLayout'
import { GetServerSideProps } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type Props = {
    session: any
}

export default function AccountPage({ session }: Props) {
    console.log("🚀 ~ file: [[...account]].tsx:15 ~ AccountPage ~ session:", session)
    const router = useRouter()
    const render = AccPage.find(i => i.href === router.asPath)?.element
    return (
        <SideMenuLayout>
            {render ? render : <NotFoundPage />}
        </SideMenuLayout>
    )
}

// Export the `session` prop to use sessions with Server Side Rendering
export const getServerSideProps: GetServerSideProps<{
    session: Session | null
}> = async (context) => {
    const session = await getSession(context)

    if (!session) return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    }

    return {
        props: { session },
    }
}