import OrderPlacementForm from '@/components/form/OrderPlacementForm'
import { Transition } from '@headlessui/react'
import CheckoutItem from './CheckoutItem'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import { useCheckoutContext } from '@/contexts/checkoutContext'

type Props = {}
export default function CreateOrder({ }: Props) {
    const browserWidth = useBrowserWidth()
    const { checkoutContext } = useCheckoutContext()
    if (checkoutContext.checkoutStage !== 0) return null
    return (
        <div className='grow grid grid-cols-1 xl:grid-cols-2 p-5'>
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
            {browserWidth > 1024 && <CheckoutItem />}
        </div>
    )
}