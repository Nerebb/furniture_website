import FormikField from '@/components/form/FormikField'
import axios, { allowedField } from '@/libs/axiosApi'
import { CheckoutFormSchemaValidate, UserSchemaValidate } from '@/libs/schemaValitdate'
import { newOrder } from '@/pages/api/user/order'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormRow } from '@types'
import { Form, Formik, FormikHelpers } from 'formik'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Button from '../Button'
import Modal from '../Modal'
import { Dispatch, SetStateAction, useState } from 'react'
import { CheckoutStage } from '@/pages/checkout'
import { useCheckoutContext } from '@/contexts/checkoutContext'

type Props = {
}

type newOrderForm = Omit<newOrder,
    'ownerId'
    | 'subTotal'
    | 'total'
    | 'status'
    | 'shippingFee'
    | 'orderItems'
> & {
    name: string,
    phoneNumber: string,
    email: string,
}


export default function OrderPlacementForm({ }: Props) {
    const { data: session } = useSession()
    const [submitError, setSubmitError] = useState<string | undefined>()
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()
    const { mutate: axiosUpdateUser } = useMutation({
        mutationKey: ['updateProfile', session?.id],
        mutationFn: (data: allowedField): Promise<{ message: String }> => axios.updateUser(session!.id as string, data),
        onSuccess: () => {
            toast.success('Update profile completed')
        }
    })

    const mutateCreateOrder = useMutation({
        mutationKey: ['createOrder'],
        mutationFn: (params: Omit<newOrder, "ownerId">) => axios.createNewOrder(params),
        onSuccess: (data) => setCheckoutContext({ checkoutStage: 1, stripeClient: { orderId: data.orderId, updateQty: false } })
    })

    const UserProfile = useQuery({
        queryKey: ['userProfile', session?.id],
        queryFn: () => axios.getUser(session!.id as string),
        enabled: !!session?.id,
    })

    const ShoppingCart = useQuery({
        queryKey: ['ShoppingCart'],
        queryFn: () => axios.getShoppingCart(),
    })

    //UserInfo
    const userRow: FormRow[] = [
        { id: 0, label: 'Name', name: 'name', inputType: 'text' },
        { id: 1, label: 'Phone number', name: 'phoneNumber', inputType: 'number' },
        { id: 3, label: "Email", name: 'email', inputType: 'email' },
        { id: 4, label: 'Billing address', name: 'billingAddress', inputType: 'text' },
        { id: 5, label: 'Delivery address', name: 'shippingAddress', inputType: 'text' },
    ]

    const initValue = {
        name: UserProfile.data?.name || "",
        phoneNumber: UserProfile.data?.phoneNumber || "",
        email: UserProfile.data?.email || "",
        billingAddress: UserProfile.data?.address || "",
        shippingAddress: UserProfile.data?.address || "",
        shoppingCartId: ShoppingCart.data?.id || "",
    }

    function checkDirty(values: newOrderForm): boolean {
        //CheckUser: if change then pops confirm change => mutate updateUser
        if (values.name !== UserProfile.data?.name
            || values.phoneNumber !== UserProfile.data?.phoneNumber
            || values.email !== UserProfile.data?.email
            || values.billingAddress !== UserProfile.data?.address
        ) {
            return true
        } else {
            return false
        }
    }

    async function handleOnSubmit(values: newOrderForm, { setSubmitting }: FormikHelpers<newOrderForm>) {
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 2000)); //Debounce

        try {
            mutateCreateOrder.mutate({ ...values })
        } catch (error: any) {
            setSubmitError(error.message || "CreateOrder: Unknown error")
        }

        setSubmitting(false)
    }

    async function updateUser(values: newOrderForm, props: FormikHelpers<newOrderForm>) {
        //Update User profile
        axiosUpdateUser({ name: values.name, phoneNumber: values.phoneNumber, email: values.email, address: values.billingAddress })
        await new Promise(r => setTimeout(r, 2000)); // Debounce

        //CreateOrder
        handleOnSubmit(values, props)
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
                            <h1 className='text-3xl mb-12 font-semibold'>Order placement:</h1>
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
                            <div className='flex-center'>
                                {!checkDirty(values) ? (
                                    <Button
                                        text="Proceed to payment"
                                        glowModify='noAnimation'
                                        modifier='w-80 py-3'
                                        type='submit'
                                    />
                                ) : (
                                    <Modal
                                        btnProps={{
                                            text: "Proceed to payment",
                                            glowModify: 'noAnimation',
                                            modifier: 'w-80 py-3',
                                        }}
                                        title='User info has been modified!'
                                        content='Do you want to update personal info'
                                        dialogBtnText={{
                                            accept: "Update",
                                            refuse: "Refuse"
                                        }}
                                        acceptCallback={() => updateUser(values, props)}
                                        refuseCallback={() => handleOnSubmit(values, props)}
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