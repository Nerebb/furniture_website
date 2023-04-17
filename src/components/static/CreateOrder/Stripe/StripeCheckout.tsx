import { useCheckoutContext } from "@/contexts/checkoutContext";
import getStripe from "@/libs/getStripe";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import React from "react";
import Loading from "../../Loading";
import StripeForm from "./StripeForm";

const stripePromise = getStripe()

export default function StripeCheckout() {
    const [clientSecret, setClientSecret] = React.useState("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { checkoutContext } = useCheckoutContext()
    React.useEffect(() => {
        setIsLoading(true)

        // Create PaymentIntent as soon as the page loads
        fetch(`/api/checkout?orderId=${checkoutContext.stripeClient.orderId}&updateQty=${checkoutContext.stripeClient.updateQty}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.log("stripe", error));

        setIsLoading(false)
    }, [
        checkoutContext.stripeClient.orderId,
        checkoutContext.stripeClient.updateQty
    ]);

    // const stripeQuery = useQuery({
    //     queryKey: ['StripeClient'],
    //     queryFn: () => axios.generateClient({ ...checkoutContext.stripeClient }),
    //     onSuccess: (res) => {
    //         if (res.clientSecret) setClientSecret(res.clientSecret)
    //     }
    // })

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: "#94B8D7",
            colorDanger: "#FD8A8A",
            fontFamily: "Inter var",
            fontSizeSm: "16px",
            fontWeightNormal: "600"
        },
    };
    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    return (
        <div className="h-full w-full flex flex-col items-center">
            <h1 className='text-3xl mb-12 font-semibold'>Card payment</h1>
            {isLoading && (
                <div className="flex-center">
                    <Loading />
                </div>
            )}
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <StripeForm />
                </Elements>
            )}
        </div>
    );
}