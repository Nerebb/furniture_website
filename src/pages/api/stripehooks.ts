// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from './checkout';

type Data = {
    message?: string
}
const endpointSecret = process.env.SECRET

export async function nodeMailer() {

}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.POST:
            try {
                let event = req.body

                if (endpointSecret) {
                    // Get the signature sent by Stripe
                    const signature = req.headers['stripe-signature'];
                    if (!signature || typeof signature !== 'string') throw new Error("Invalid signature")
                    try {
                        event = stripe.webhooks.constructEvent(
                            req.body,
                            signature,
                            endpointSecret
                        );
                    } catch (err: any) {
                        throw new Error("Webhook signature verification failed", err.message)
                    }
                }

                switch (event.type) {
                    case 'payment_intent.succeeded':
                        return res.status(200).json({ message: "Payment intent success" })
                    default:
                        throw new Error("Unhandled payments event")
                }
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "StripeHooks: Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
