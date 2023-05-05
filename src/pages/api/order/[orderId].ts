// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { isUUID } from '@/libs/schemaValitdate';
import { Prisma, Role, Status } from '@prisma/client';
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { JWT } from 'next-auth/jwt';
import { ResponseOrder, orderIncludesParams, santinizeOrder } from '.';
import { SignedUserData, verifyToken } from '../auth/customLogin';

type Data = {
    data?: ResponseOrder
    message: string
}

/**
 * @method GET
 * @description get one Order that contains details of Order items
 * @param orderId from req.query
 * @returns ResponseOrder
 */
export async function getOrderDetail(orderId: string) {
    const data = await prismaClient.order.findUniqueOrThrow({
        where: { id: orderId },
        include: orderIncludesParams
    })
    if (!data.orderedProducts || !data.orderedProducts?.length) throw new Error('Products not found or deleted')

    const response = await santinizeOrder(data, true)

    return response
}

/**
 * @method delete
 * @description update Order status to canceled (soft delete)
 * @param userId Get from cookies JWT
 * @param orderId req.query
 * @return message
 */
export async function cancelUserOrder(role: Role, userId: string, orderId: string) {
    //CheckIs UserValid
    let deleteOrderParams: Prisma.OrderWhereInput = {
        id: orderId
    }

    if (role !== 'admin') deleteOrderParams = { id: orderId, ownerId: userId }

    const userOrder = await prismaClient.order.findFirstOrThrow({
        where: deleteOrderParams,
    })

    if (userOrder.status === Status.completed
        || userOrder.status === Status.shipping
        || userOrder.status === Status.orderCanceled
    )
        throw new Error("Cannot cancel order")

    await prismaClient.order.updateMany({
        where: deleteOrderParams,
        data: {
            status: Status.orderCanceled
        },
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | null;
    try {
        token = await verifyToken(req)
        if (!token || !token.userId) throw new Error("Unauthorize user")
    } catch (error: any) {
        return res.status(405).json({ message: error.message || error })
    }

    let orderId;
    let userId = token.userId;
    try {
        orderId = await isUUID.validate(req.query.orderId)
    } catch (error: any) {
        return res.status(400).json({ message: "Invalid Order Id" })
    }

    if (token.role === 'admin') {
        try {
            userId = await isUUID.validate(req.query.userId)
        } catch (error: any) {
            return res.status(401).json({ message: "Invalid userId" })
        }
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getOrderDetail(orderId)
                return res.status(200).json({ data, message: "Get OrderDetail success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetOrderDetail: Unknown error" })
            }

        case ApiMethod.DELETE:
            try {
                await cancelUserOrder(token.role, userId, orderId)
                return res.status(200).json({ message: "Order has been canceled by User" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" });
    }
}
