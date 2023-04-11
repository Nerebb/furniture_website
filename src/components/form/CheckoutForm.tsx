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

type Props = {}

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


export default function CheckoutForm({ }: Props) {
    const { data: session } = useSession()
    const { mutate } = useMutation({
        mutationKey: ['updateProfile', session?.id],
        mutationFn: (data: allowedField): Promise<{ message: String }> => axios.updateUser(session!.id as string, data),
        onSuccess: () => {
            toast.success('Update profile completed')
        }
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

    //Delivery
    //CreditCard

    const initValue = {
        name: UserProfile.data?.name || "",
        phoneNumber: UserProfile.data?.phoneNumber || "",
        email: UserProfile.data?.email || "",
        billingAddress: UserProfile.data?.address || "",
        shippingAddress: UserProfile.data?.address || "",
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

    function handleOnSubmit(values: newOrderForm, { setSubmitting, }: FormikHelpers<newOrderForm>) {
        console.log("Form Submitted!!!")
        const orderItems = ShoppingCart.data?.shoppingCartItem.map(i => ({
            productId: i.productId,
            color: i.color,
            quantities: i.quantities
        }))


    }

    async function acceptCallback(values: newOrderForm, props: FormikHelpers<newOrderForm>) {
        //Update User profile
        mutate({ name: values.name, phoneNumber: values.phoneNumber, email: values.email, address: values.billingAddress })
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
                        className=''
                    >
                        {/* User */}
                        <div className='h-full w- w-3/4 space-y-8 flex flex-col justify-center'>
                            <h1 className='text-3xl mb-12'>Order placement</h1>
                            {userRow.map(row => (
                                <FormikField
                                    key={row.id}
                                    type={row.inputType}
                                    id={row.id}
                                    label={row.label}
                                    name={row.name}
                                />
                            ))}
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
                                            accept: "Update profile",
                                            refuse: "Proceed to payment"
                                        }}
                                        acceptCallback={() => acceptCallback(values, props)}
                                        refuseCallback={async () => handleOnSubmit(values, props)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Shipping */}
                        {/* <div className='text-2xl'>Available shipping option:</div> */}

                        {/* Payment */}
                    </Form>
                )}
            </Formik>
        </>
    )
}