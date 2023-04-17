import Modal from '@/components/Modal'
import { useCheckoutContext } from '@/contexts/checkoutContext'
import { Transition } from '@headlessui/react'
import StripeCheckout from './Stripe/StripeCheckout'
import { useRouter } from 'next/router'

type Props = {}

export default function StripePayment({ }: Props) {
    const router = useRouter()
    const { checkoutContext } = useCheckoutContext()
    return (
        <div >
            <Transition
                appear={true}
                show={checkoutContext.checkoutStage === 1 || checkoutContext.checkoutStage === 2}
                className='mx-10 w-full grow mt-8 space-y-8 mb-8'
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
                    title='Payment successful'
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
        </div >
    )
}