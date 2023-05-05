import React from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import Button from "@/components/Button";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import Loading from "../../Loading";
import { useCheckoutContext } from "@/contexts/checkoutContext";

export default function StripeForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()
    const [message, setMessage] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) return setMessage("Something went wrong")
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                // return_url: "http://localhost:3000/products",
            },
            redirect: 'if_required'
        });


        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
            setMessage("An unexpected error occurred.")
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "CardPayment: Unknown error");
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else {
            // setMessage(`Payment succeeded: ${paymentIntent.id}`)
            setCheckoutContext({ ...checkoutContext, checkoutStage: 2 })
        }
        setIsLoading(false);
    };

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: "tabs",
    };

    return (
        <form
            id="payment-form"
            className="w-[500px]"
            onSubmit={handleSubmit}
        >
            {/* <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.target.value)}
            /> */}
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <Button
                type="submit"
                text={isLoading ? "" : "Pay now"}
                glowModify="noAnimation"
                disabled={isLoading || !stripe || !elements}
                modifier="px-9 py-1 w-[140px] flex-center mt-5 dark:text-white"
            >
                {isLoading && <Loading className="w-6 h-6 fill-priBlue-500 text-white" />}
            </Button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message" className="text-red-500 font-semibold mt-5">{message}</div>}
        </form>
    );
}