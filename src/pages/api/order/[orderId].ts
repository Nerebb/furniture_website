// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { UpdateOrderSchemaValidate, isUUID } from '@/libs/schemaValitdate';
import { Prisma, Role, Status } from '@prisma/client';
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { JWT } from 'next-auth/jwt';
import { ResponseOrder, orderIncludesParams, santinizeOrder } from '.';
import { SignedUserData, verifyToken } from '../auth/customLogin';
import * as Yup from 'yup'

type Data = {
    data?: ResponseOrder
    message: string
}

/**
 * @method GET /api/order/:orderId
 * @description get one Order that contains details of Order items
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
 * @method POST /api/order/:orderId
 * @description Edit one Order
 * @access Admin only
 * @return message
 */
type UpdateOrder = {
    id: string,
    shippingFee?: number,
    subTotal?: number,
    total?: number,
    status?: Status
}
export async function updateOrderDetail(order: UpdateOrder) {
    const data = await prismaClient.order.update({
        where: { id: order.id },
        data: {
            shippingFee: order.shippingFee,
            subTotal: order.subTotal,
            total: order.total,
            status: order.status
        },
        include: orderIncludesParams
    })
    const response = santinizeOrder(data)
    return response
}

/**
 * @method DELETE  /api/order/:orderId?userId=<string>
 * @description update Order status to canceled (soft delete)
 * @access Only admin can access userId from req.query, others will get userId from JWT token
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

    if (role !== 'admin' &&
        (userOrder.status === Status.completed
            || userOrder.status === Status.shipping
            || userOrder.status === Status.orderCanceled)
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
    const token = await verifyToken(req, res)
    if (!token || !token.userId) return res.status(401).send({ message: "Invalid user" })

    let orderId;
    let userId = token.userId;
    try {
        orderId = await isUUID.validate(req.query.orderId)
    } catch (error: any) {
        return res.status(400).json({ message: "Invalid Order Id" })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getOrderDetail(orderId)
                return res.status(200).json({ data, message: "Get OrderDetail success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetOrderDetail: Unknown error" })
            }
        case ApiMethod.POST:
            try {
                if (token.role !== 'admin') return res.status(401).json({ message: "EditOrder: Unauthorize user" })
                const requestUpdate = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

                const schema = Yup.object(UpdateOrderSchemaValidate)

                const validated = await schema.validate(requestUpdate)

                const data = await updateOrderDetail({ id: orderId, ...validated })
                if (!data) throw new Error("Order not found")
                return res.status(200).json({ data, message: "Update order success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetOrderDetail: Unknown error" })
            }
        case ApiMethod.DELETE:
            if (token.role === 'admin') {
                try {
                    const id = await isUUID.notRequired().validate(req.query.userId)
                    if (id) userId = id
                } catch (error: any) {
                    return res.status(400).json({ message: "Invalid userId" })
                }
            }
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
