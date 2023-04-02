// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { isUUID, isValidNum, isValidStatus } from '@/libs/schemaValitdate';
import { Product, Status } from '@prisma/client';
import { ApiMethod } from '@types';
import { GetColorName } from 'hex-color-to-color-name';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export type OrderedItem = {
    id: string
    salePrice: number
    totalQuantities: number
    colors: { id: string, quantities: number }[]
    orderId: string
    name: string
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
}

type Data = {
    data?: UserOrder[] | OrderedItem[]
    message?: string
}

/**
 * @method GET
 * @description Get current user order
 * @param userId Get from cookies JWT
 * @param productId req.query
 * @returns UserOrder[] & status
 */
export async function getUserOrders(userId: string, take: number | undefined, skip: number | undefined, status: Status | undefined) {
    const orders = await prismaClient.order.findMany({
        where: { ownerId: userId, status },
        include: {
            orderedProducts: { select: { id: true, } }
        },
        take: take,
        skip,
    })

    //Santinize data
    const responseData: UserOrder[] = orders.map(order => {
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
 * @param orderId: string
 * @return OrderedItem[]
 */
export async function getOrderedProducts(orderId: string) {

    const data = await prismaClient.orderItem.findMany({
        where: { orderId },
    })

    const productIds = data.map(i => i.productId)

    const productDetails = await prismaClient.product.findMany({
        where: { id: { in: productIds } }
    })

    const responseData: OrderedItem[] = data.map(product => ({
        id: product.id,
        salePrice: product.salePrice,
        totalQuantities: product.quantities,
        colors: product.color as Array<{ id: string, quantities: number }>,
        orderId: product.orderId,
        name: productDetails.find(i => i.id === product.id)?.name || "Unknown",
    }))

    return responseData
}

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
        || userOrder.status === Status.shipping
        || userOrder.status === Status.orderCanceled
    )
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
    if (!token?.userId || !token) return res.status(401).redirect('/login').json({ message: "Unauthorize User redirect to login page" })

    const userId = token.userId
    const { orderId, take, skip, status, grid } = req.query;

    let validatedSkip: number | undefined;
    let validatedTake: number | undefined;
    let validatedOrderId: string | undefined;
    let validatedStatus: Status | undefined;
    try {
        if (orderId) validatedOrderId = await isUUID.validate(orderId)
    } catch (error: any) {
        return res.status(401).json({ message: error.message })
    }

    try {
        if (skip && userId) validatedSkip = await isValidNum.validate(parseInt(skip as string))
        if (take && userId) validatedTake = await isValidNum.validate(parseInt(take as string))
        if (status) validatedStatus = await isValidStatus.validate(status)
    } catch (error: any) {
        return res.status(400).json({ message: error.message })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                async function switchGetMethod() {
                    if (validatedOrderId) {
                        return await getOrderedProducts(validatedOrderId)
                    }
                    if (userId) return await getUserOrders(userId, validatedTake, validatedSkip, validatedStatus)
                }

                const data = await switchGetMethod()
                return res.status(200).json({ data, message: "Get user Order success" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
        case ApiMethod.PUT:
            try {
                await cancelUserOrder(userId as string, orderId as string)
                return res.status(200).json({ message: "Order has been canceled by User" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: 'UNKNOWN EROR' })
    }
}
