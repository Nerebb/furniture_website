import Modal from '@/components/Modal'
import { useCheckoutContext } from '@/contexts/checkoutContext'
import { Transition } from '@headlessui/react'
import StripeCheckout from './Stripe/StripeCheckout'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from '@/libs/axiosApi'

type Props = {}

export default function StripePayment({ }: Props) {
    const router = useRouter()
    const { checkoutContext } = useCheckoutContext()
    return (
        <>
            <Transition
                appear={true}
                as='div'
                show={checkoutContext.checkoutStage === 1 || checkoutContext.checkoutStage === 2}
                className='grow flex-center mx-10 w-full mt-8 space-y-8 mb-8'
                enter='transition duration-300'
                enterFrom='opacity-0 translate-y-5'
                enterTo='opacity-100 translate-y-0'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-5'
            >
                <StripeCheckout />
            </Transition >

            {
                checkoutContext.checkoutStage === 2 && <Modal
                    content='Your payment has been successfully submitted. We’ve sent
                    you an email with all of the details of your order.'
                    dialogBtnText={{
                        accept: "Got it,thanks",
                        refuse: ""
                    }}
                    acceptCallback={() => router.push('/')}
                    isRefuse={false}
                    keepOpen={true}
                />
            }
        </ >
    )
}