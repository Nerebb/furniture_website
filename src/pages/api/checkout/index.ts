// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { isUUID } from '@/libs/schemaValitdate';
import { ApiMethod } from '@types';
import { verify } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import { verifyToken } from '../auth/customLogin';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export type stripeRes = {
    clientSecret?: string,
    message?: string,
}
/**
 * @method POST
 * @description Generating a payment intent for new order
 * @body orderId
 * @returns StripeClientKey
 * @access Login required
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<stripeRes>
) {
    switch (req.method) {
        case ApiMethod.POST:
            try {
                const token = await verifyToken(req)
                if (!token || !token?.userId) return res.status(401).json({ message: "Unauthorize User" })

                const orderId = await isUUID.validate(req.query.orderId)
                const userId = token.userId

                const order = await prismaClient.order.findFirstOrThrow({
                    where: { id: orderId, ownerId: userId }
                })

                // Create a PaymentIntent with the order amount and currency
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Number(order.total), //max amout 99,999,999 vnd
                    currency: "vnd",
                    metadata: { orderId, userId },
                });

                if (!paymentIntent.client_secret) return res.status(500).send({ message: "Stripe cannot idenify User" })

                return res.status(200).send({
                    clientSecret: paymentIntent.client_secret,
                });
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }

        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
