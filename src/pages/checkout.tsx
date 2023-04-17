import CreateOrder from '@/components/static/CreateOrder'
import StripePayment from '@/components/static/CreateOrder/StripePayment'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'

type Props = {}

export enum CheckoutStage {
    'CreateOrder',
    'PaymentType',
    'OnlinePaySuccess'
}

export default function CheckoutPage({ }: Props) {
    return (
        <CheckoutLayout
            tabTitle='Order overview'
        >
            {/* Stage 1 */}
            <CreateOrder />

            {/* Stage 2 */}
            <StripePayment />
        </CheckoutLayout>
    )
}