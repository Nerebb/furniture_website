import FormikField from '@/components/form/FormikField'
import { useCheckoutContext } from '@/contexts/checkoutContext'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import axios, { allowedField } from '@/libs/axiosApi'
import { CheckoutFormSchemaValidate, NewOrderSchemaValidate } from '@/libs/schemaValitdate'
import { NewOrder } from '@/pages/api/order'
import { UserShoppingCart } from '@/pages/api/user/shoppingCart'
import { Dialog } from '@headlessui/react'
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormRow } from '@types'
import { Form, Formik, FormikHelpers } from 'formik'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../Button'
import Modal from '../Modal'
import CheckoutItem from '../static/CreateOrder/CheckoutItem'

type Props = {
} & UseQueryResult<UserShoppingCart>

type NewOrderForm = Partial<NewOrder> & {
    name: string,
    phoneNumber: string,
    email: string,
}

//UserInfo
const userRow: FormRow[] = [
    { id: 0, label: 'Name', name: 'name', inputType: 'text' },
    { id: 1, label: 'Phone number', name: 'phoneNumber', inputType: 'number' },
    { id: 3, label: "Email", name: 'email', inputType: 'email' },
    { id: 4, label: 'Billing address', name: 'billingAddress', inputType: 'text' },
    { id: 5, label: 'Delivery address', name: 'shippingAddress', inputType: 'text' },
]


export default function OrderPlacementForm({ ...cart }: Props) {
    const { data: session } = useSession()
    const [submitError, setSubmitError] = useState<string | undefined>()
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()
    const browserWidth = useBrowserWidth()
    const queryClient = useQueryClient()

    const mutateUpdateUser = useMutation({
        mutationKey: ['userProfile', session?.id],
        mutationFn: (data: allowedField): Promise<{ message: String }> => axios.updateUser(data, session?.id),
        onSuccess: () => {
            queryClient.invalidateQueries()
            toast.success('Update profile completed', { toastId: session?.id })
        }
    })

    const mutateCreateOrder = useMutation({
        mutationKey: ['createOrder'],
        mutationFn: (params: NewOrder) => axios.createNewOrder(params),
        onSuccess: (data) => {
            setCheckoutContext({
                checkoutStage: 1,
                stripeClient: {
                    orderDetail: data,
                    updateQty: false
                }
            })
        }
    })

    const UserProfile = useQuery({
        queryKey: ['userProfile', session?.id],
        queryFn: () => axios.getUser(session?.id),
        enabled: !!session?.id,
    })

    const initValue = {
        name: UserProfile.data?.name || "",
        phoneNumber: UserProfile.data?.phoneNumber || "",
        email: UserProfile.data?.email || "",
        billingAddress: UserProfile.data?.address || "",
        shippingAddress: UserProfile.data?.address || "",
        cartId: cart.data?.id || "",
        products: cart.data?.shoppingCartItem
    }

    async function handleOnSubmit(values: NewOrderForm, { setSubmitting }: FormikHelpers<NewOrderForm>) {
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 2000)); //Debounce

        try {
            const schema = Yup.object(NewOrderSchemaValidate)
            const validated = await schema.validate(values)
            mutateCreateOrder.mutate({ ...validated })
        } catch (error: any) {
            setSubmitError(error.message || "CreateOrder: Unknown error")
        }

        setSubmitting(false)
    }

    async function updateUser(values: NewOrderForm, props: FormikHelpers<NewOrderForm>) {
        //Update User profile
        mutateUpdateUser.mutate({ name: values.name, phoneNumber: values.phoneNumber, email: values.email, address: values.billingAddress })
        await new Promise(r => setTimeout(r, 2000)); // Debounce

        //CreateOrder
        if (mutateUpdateUser.isError || !mutateUpdateUser.isLoading) handleOnSubmit(values, props)
    }

    return (
        <>
            <Formik
                initialValues={initValue}
                enableReinitialize={true}
                validationSchema={Yup.object(CheckoutFormSchemaValidate)}
                onSubmit={handleOnSubmit}
            >
                {({ values, ...props }) => (
                    <Form
                        className='w-full'
                    >
                        {/* User */}
                        <div className='space-y-8'>
                            <h1 className='text-3xl mb-12 font-semibold dark:text-white'>Order placement:</h1>
                            {userRow.map(row => (
                                <FormikField
                                    key={row.id}
                                    type={row.inputType}
                                    id={row.id}
                                    label={row.label}
                                    name={row.name}
                                />
                            ))}
                            {submitError && <p>{submitError}</p>}
                            <div className='flex-center space-x-10'>
                                {!props.dirty ? (
                                    <>
                                        {browserWidth <= 1024 && <Modal
                                            btnProps={{
                                                text: "Order detail",
                                                glowModify: 'noAnimation',
                                                modifier: 'w-60 py-3 dark:text-white',
                                                disabled: props.isSubmitting || !cart.data,
                                            }}
                                        >
                                            <Dialog.Panel
                                                className='flex justify-start'
                                            >
                                                <CheckoutItem {...cart} />
                                            </Dialog.Panel>
                                        </Modal>}
                                        <Button
                                            text="Proceed to payment"
                                            glowModify='noAnimation'
                                            modifier='w-60 py-3 dark:text-white'
                                            type='submit'
                                            disabled={props.isSubmitting || !cart.data}
                                        />
                                    </>
                                ) : (
                                    <Modal
                                        btnProps={{
                                            text: "Update user data",
                                            glowModify: 'noAnimation',
                                            modifier: 'w-60 py-3 dark:text-white',
                                            disabled: props.isSubmitting || !cart.data
                                        }}
                                        title='User info has been modified!'
                                        content='Do you want to update personal info'
                                        dialogBtnText={{
                                            accept: "Update",
                                            refuse: "Refuse"
                                        }}
                                        acceptCallback={() => updateUser(values, props)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Shipping */}
                        {/* <div className='text-2xl'>Available shipping option:</div> */}
                    </Form>
                )}
            </Formik>
        </>
    )
}