// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from './checkout';
import nodemailer from 'nodemailer'
import prismaClient from '@/libs/prismaClient';

type Data = {
    message?: string
}
const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK
export const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nereb.furniture@gmail.com",
        pass: process.env.GOOGLE_PASS
    }
})
export default async function handler(
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
                        const { userId, orderId } = event.data.object.metadata

                        await prismaClient.order.update({
                            where: { id: orderId },
                            data: { status: 'shipping' }
                        })

                        if (!userId) return res.status(500).json({ message: `PaymentId:${req.body.id} userId not found` })
                        const user = await prismaClient.user.findFirstOrThrow({
                            where: { id: userId }
                        })
                        if (!user.email) return res.status(400).json({ message: `User-${userId}: Dont have registered email` })

                        const mainOptions = {
                            from: "Nereb furniture",
                            to: user.email,
                            subject: "Thank you for your purchased",
                            html: `<p>Payment success OrderID:${orderId} - amount ${event.data.object.amount} VND </p>`
                        }

                        transporter.sendMail(mainOptions, function (err, info) {
                            if (err) {
                                console.log("NodeMailer-Send", err);
                                throw err
                            }
                        })

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
