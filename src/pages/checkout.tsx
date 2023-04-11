import Modal from '@/components/Modal'
import CheckoutForm from '@/components/form/CheckoutForm'
import CheckoutItem from '@/components/static/Checkout/CheckoutItem'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'

type Props = {}

export default function Checkout({ }: Props) {

    return (
        <>
            <CheckoutLayout
                tabTitle='Order overview'
                leftSide={<CheckoutForm />}
                rightSide={<CheckoutItem />}
            />
        </>
    )
}