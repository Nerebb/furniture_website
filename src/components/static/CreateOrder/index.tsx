import OrderPlacementForm from '@/components/form/OrderPlacementForm'
import { Transition } from '@headlessui/react'
import CheckoutItem from './CheckoutItem'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import { initCheckoutContext, useCheckoutContext } from '@/contexts/checkoutContext'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import axios from '@/libs/axiosApi'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import AssignForm from '@/components/form/AssignForm'

type Props = {}
export default function CreateOrder({ }: Props) {
    const { data: session } = useSession()
    console.log("🚀 ~ file: index.tsx:16 ~ CreateOrder ~ session:", session)

    const browserWidth = useBrowserWidth()
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()

    const userCart = useQuery({
        queryKey: ['ShoppingCart'],
        queryFn: () => axios.getShoppingCart(),
    })

    if (checkoutContext.checkoutStage !== 0) return <></>
    return (
        <>
            {session?.user.role === 'guest' && <AssignForm type='login' keepOpen />}
            <div className='grow grid grid-cols-1 xl:grid-cols-2 p-5'>
                {/* UserProfile */}
                <Transition
                    appear={true}
                    show={true}
                    className="w-full flex-center flex-col px-20 transition duration-300"
                    enterFrom='opacity-0 translate-y-5'
                    enterTo='opacity-100 translate-y-0'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-5'
                >
                    <OrderPlacementForm {...userCart} />
                </Transition>

                {/* Items */}
                {browserWidth > 1024 && <CheckoutItem {...userCart} />}
            </div>
        </>
    )
}