import { useCheckoutContext } from "@/contexts/checkoutContext";
import getStripe from "@/libs/getStripe";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import React, { useMemo } from "react";
import Loading from "../../Loading";
import StripeForm from "./StripeForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axiosApi";
import { toast } from "react-toastify";
import { useTheme } from 'next-themes'
const stripePromise = getStripe()

export default function StripeCheckout() {
    const { checkoutContext } = useCheckoutContext()
    const { theme } = useTheme()
    const { data: stripeClient, isLoading } = useQuery({
        queryKey: ["StripePayment"],
        queryFn: () => axios.generateClient(checkoutContext.stripeClient.orderDetail!.id),
        enabled: !!checkoutContext.stripeClient.orderDetail?.id,
        onError: (error: any) => {
            toast.error(error.toString())
        }
    })

    const appearance: Appearance = useMemo(() => {
        if (theme === 'dark') return {
            theme: 'night',
            variables: {
                colorPrimary: "#94B8D7",
                colorDanger: "#FD8A8A",
                colorBackground: '#303030',
                fontFamily: "Inter var",
                fontSizeSm: "16px",
                fontWeightNormal: "600"
            },
        }

        return {
            theme: 'stripe',
            variables: {
                colorPrimary: "#94B8D7",
                colorDanger: "#FD8A8A",
                fontFamily: "Inter var",
                fontSizeSm: "16px",
                fontWeightNormal: "600"
            },
        }
    }, [theme]);
    const options: StripeElementsOptions = {
        clientSecret: stripeClient?.clientSecret ?? "",
        appearance,
    };

    return (
        <div className="flex flex-col items-center p-5 dark:border dark:border-priBlack-400 rounded-xl">
            <h1 className='text-3xl mb-12 font-semibold dark:text-white'>Card payment</h1>
            {isLoading && (
                <div className="flex-center">
                    <Loading />
                </div>
            )}
            {stripeClient?.clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <StripeForm />
                </Elements>
            )}
        </div>
    );
}