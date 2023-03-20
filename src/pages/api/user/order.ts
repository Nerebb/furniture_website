// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { isUUID } from '@/libs/schemaValitdate';
import { Status } from '@prisma/client';
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export type OrderedItem = {
    id: string
    salePrice: number
    totalQuantities: number
    colors: { id: string, quantities: number }[]
    orderId: string
    name: string
    imageUrls: string[]
}

export type UserOrder = {
    id: string
    subTotal: string
    shippingFee: number
    total: string
    billingAddress: string
    shippingAddress: string
    status: Status
    createdDate: string
    updatedAt: string
    orderedProductIds?: string[]
}

type Data = {
    data?: UserOrder[]
    message?: string
}

/**
 * @method GET
 * @param userId Get from cookies JWT
 * @param productId req.query
 * @returns UserOrder[] & status
 */
export async function getUserOrders(userId: string) {
    const orders = await prismaClient.order.findMany({
        where: { ownerId: userId },
        include: {
            orderedProducts: { select: { id: true } }
        }
    })


    //Santinize data
    const responseData: UserOrder[] = orders.map(order => {
        // const orderedProducts: UserOrder['orderedProducts'] = order.orderedProducts.map(product => ({
        //     id: product.id,
        //     salePrice: product.salePrice,
        //     totalQuantities: product.quantities,
        //     colors: product.color as Array<{ id: string, quantities: number }>,
        //     orderId: product.orderId,
        //     name: product.product.name,
        //     imageUrls: product.product.image.map(i => i.imageUrl)
        // }))

        return {
            id: order.id,
            billingAddress: order.billingAddress,
            shippingAddress: order.shippingAddress,
            shippingFee: order.shippingFee,
            status: order.status,
            subTotal: order.subTotal.toString(),
            total: order.total.toString(),
            orderedProductsIds: order.orderedProducts.map(i => i.id),
            createdDate: order.createdDate.toString(),
            updatedAt: order.updatedAt.toString(),
        }
    })

    return responseData
}

/**
 * @method GET
 * @param orderedProductIds
 * @return OrderedItem[]
 */

/**
 * @method delete
 * @param userId Get from cookies JWT
 * @param orderId req.query
 */
export async function cancelUserOrder(userId: string, orderId: string) {
    //CheckIs UserValid
    const userOrder = await prismaClient.order.findFirstOrThrow({
        where: { id: orderId, ownerId: userId },
    })

    if (userOrder.status === Status.completed
        || userOrder.status === Status.processingOrder)
        throw new Error("Cannot cancel order")

    await prismaClient.order.update({
        where: { id: orderId },
        data: {
            status: Status.orderCanceled
        },
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await getToken({
        req,
        secret: process.env.SECRET
    },)

    // if (!token?.userId || !token) return res.redirect('/login')

    // const userId = token.userId
    let { orderId, userId } = req.query;

    try {
        if (orderId) orderId = await isUUID.validate(req.query.orderId)
    } catch (error: any) {
        return res.status(401).json({ message: error.message })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getUserOrders(userId as string)
                return res.status(200).json({ data, message: "Get user Order success" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                await cancelUserOrder(userId as string, orderId as string)
                return res.status(200).json({ message: "Order has been canceled by User" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        default:
            break;
    }
}
