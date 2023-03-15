import ProfileForm from '@/components/form/ProfileForm';
import { UserProfile } from '@types';
import Card from '../../Card';

type Props = {
    userData?: UserProfile
}

export default function AccProfile({ userData }: Props) {
    return (
        <Card modify='h-fit max-w-[820px] mx-auto p-5'>
            {/* Title */}
            <article className="px-4 py-5 sm:px-6 flex justify-between">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                </div>
            </article>

            {/* FormikForm */}
            <ProfileForm />

        </Card>
    )
}
