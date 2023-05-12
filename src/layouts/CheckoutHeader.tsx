import CusRadioGroup from '@/components/RadioGroup'
import { useCheckoutContext } from '@/contexts/checkoutContext'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

const checkoutState = [
    {
        id: 0,
        value: "Create order"
    },
    {
        id: 1,
        value: "Card payment"
    },
]

export default function CheckoutHeader() {
    const router = useRouter()
    return (
        <header className={classNames(
            'flex justify-between items-center sticky top-0 w-full h-[80px] px-2 z-50 bg-white bg-opacity-40 backdrop-blur-sm',
            //Darkmode,
            'dark:bg-priBlack-700/40 bg-opacity-10 dark:text-white',
            {
                'border-b border-solid border-priBlack-100': router.asPath !== '/',
            },
        )}
        >
            <nav className='flex items-center space-x-5'>
                <Link className="HomePage font-bold text-3xl mr-5 text-black dark:text-white" href={'/'}>NEREB</Link>
                <div className='text-gray-500 font-semibold dark:text-white'>| Order overview</div>
            </nav>
            <nav className="RightHeaderNav flex-1 flex justify-end items-center w-auto">
                <CusRadioGroup data={checkoutState} />
            </nav>
        </header>
    )
}