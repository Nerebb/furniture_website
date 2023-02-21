import ProfileForm from '@/components/form/ProfileForm';
import { IUser } from '@types';
import Card from '../../Card';

type Props = {
    userData: IUser
}

export default function AccProfile({ userData }: Props) {

    const userProfile = [
        { id: 0, label: "Full name", name: 'name', content: userData?.name },
        { id: 1, label: "Nick name", name: 'nickName', content: userData?.nickName },
        { id: 2, label: "Address", name: 'address', content: userData?.address },
        { id: 3, label: "Gender", name: 'gender', content: userData?.gender },
        { id: 4, label: "Phone number", name: 'phoneNumber', content: userData?.phoneNumber },
        { id: 5, label: "Birthday", name: 'birthDay', content: userData?.birthDay },
    ]

    return (
        <Card modify='h-fit max-w-[820px] mx-auto p-5'>
            {/* Title */}
            <article className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
            </article>

            {/* FormikForm */}
            <ProfileForm formData={userProfile} />

        </Card>
    )
}
