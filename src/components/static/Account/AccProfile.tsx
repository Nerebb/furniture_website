import Button from '@/components/Button';
import ProfileForm from '@/components/form/ProfileForm';
import axios from '@/libs/axiosApi';
import { useMutation } from '@tanstack/react-query';
import { UserProfile } from '@types';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Card from '../../Card';

type Props = {
}

export default function AccProfile({ }: Props) {
    const { data: session } = useSession()
    const router = useRouter()
    const { mutate } = useMutation({
        mutationKey: ['userProfile', session?.id],
        mutationFn: (id: string) => axios.deleteUser(id),
    })

    function handleDeleteUser() {
        if (!session?.id) return router.push('/login')
        mutate(session.id)
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })
    }
    return (
        <>
            <Card modify='h-fit max-w-[820px] mx-auto p-5'>
                {/* Title */}
                <article className="px-4 py-5 sm:px-6 flex justify-between">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details.</p>
                    </div>
                </article>

                {/* FormikForm */}
                <ProfileForm />
            </Card>

            <div className='flex-center mt-5'>
                <button
                    className='border border-red-500 rounded-lg py-1 px-2 font-semibold'
                    onClick={handleDeleteUser}
                >
                    Delete Account
                </button>
            </div>
        </>
    )
}
