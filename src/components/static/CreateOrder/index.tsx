import OrderPlacementForm from '@/components/form/OrderPlacementForm'
import { useCheckoutContext } from '@/contexts/checkoutContext'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'
import CheckoutItem from './CheckoutItem'

type Props = {}
export default function CreateOrder({ }: Props) {
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()
    if (checkoutContext.checkoutStage !== 0) return <></>
    return (
        <div className='grow grid grid-cols-2 p-5'>
            {/* UserProfile */}
            <Transition
                appear={true}
                show={true}
                className='w-full flex-center flex-col px-20'
                enter='transition duration-300'
                enterFrom='opacity-0 translate-y-5'
                enterTo='opacity-100 translate-y-0'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-5'

            >
                <OrderPlacementForm />
            </Transition>

            {/* Items */}
            <CheckoutItem />
        </div>
    )
}