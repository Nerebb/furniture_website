// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { isUUID } from '@/libs/schemaValitdate';
import { OrderItem } from '@prisma/client'
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export type stripeRes = {
    clientSecret?: string,
    message?: string,
}

export async function lineItemPrice(item: OrderItem, updateQty?: boolean): Promise<number> {
    let subTotal: number;
    const itemColors = item.color as { id: string, quantities: number }[]
    const totalQty = itemColors.reduce((total, item) => total += item.quantities, 0)

    //Re-check quantities
    switch (updateQty) {
        case true:
            await prismaClient.orderItem.update({
                where: { id: item.id },
                data: {
                    quantities: totalQty
                }
            })
            subTotal = totalQty * item.salePrice
            break;
        default:
            if (totalQty !== item.quantities) {
                const curLineItem = itemColors.reduce((message, color) => message += `${color.id} : ${color.quantities}`, `product:${item.productId} `)
                throw new Error(`Order quantities not matched-totalQty:${totalQty} : ${curLineItem}`)
            } else {
                subTotal = item.quantities * item.salePrice
            }
            break;
    }

    return subTotal
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<stripeRes>
) {
    switch (req.method) {
        case ApiMethod.POST:
            try {
                const token = await getToken({
                    req,
                    secret: process.env.SECRET
                },)
                if (!token?.userId || !token) return res.status(401).redirect('/login').json({ message: "Unauthorize User redirect to login page" })
                const orderId = await isUUID.validate(req.query.orderId)
                const { updateQty } = req.query
                const userId = token.userId

                const orderItems = await prismaClient.orderItem.findMany({
                    where: { orderId, order: { ownerId: userId } }
                })
                if (!orderItems) throw new Error("User-shoppingCart not found")
                let orderTotal: number = 0;
                for (const item of orderItems) {
                    const subTotal = await lineItemPrice(item, Boolean(updateQty))
                    if (subTotal) orderTotal += subTotal
                }

                // Create a PaymentIntent with the order amount and currency
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: orderTotal / 1000, //max amout 99,999,999 vnd
                    currency: "vnd",
                    metadata: { orderId }
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
