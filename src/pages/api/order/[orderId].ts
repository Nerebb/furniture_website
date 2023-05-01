// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiMethod, JsonColor } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CreateOrderItem, NewOrder, OrderedItem, ResponseOrder, orderIncludesParams, santinizeOrder } from '.';
import { NewOrderSchemaValidate, isUUID } from '@/libs/schemaValitdate';
import * as Yup from 'yup'
import prismaClient from '@/libs/prismaClient';
import { OrderItem, Prisma, Role, Status } from '@prisma/client';
import { JWT } from 'next-auth/jwt';
import { SignedUserData, verifyToken } from '../auth/customLogin';
import { GetColorName } from 'hex-color-to-color-name';

type Data = {
    data?: ResponseOrder
    message: string
}


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
 * @method PUT
 * @param query type Order
 * @param req.body type OrderItem
 * @return message
 */

export async function createOrder(userId: string, order: NewOrder) {
    //Mutate Data shoppingCart :color:string > color:{id,qty}
    const defaultShipFee = 20000

    const productDb = await prismaClient.product.findMany({
        where: {
            id: { in: order.products.map(i => i.productId) },
            deleted: null,
        }
    })
    if (!productDb.length || productDb.length !== order.products.length) throw new Error("Request order have invalid ProductId")
    let subTotal = 0;
    const newOrderItems: CreateOrderItem[] = []

    order.products.forEach(product => {
        const curProduct = productDb.find(i => i.id === product.productId)
        const salePrice = curProduct?.price || 0
        const productColor = curProduct?.JsonColor as string[]

        if (!productColor.includes(product.color)) throw new Error(`${product.productId} don't have color:${product.color}`)

        subTotal += (salePrice * product.quantities)

        const curColor = {
            id: GetColorName(product.color),
            quantities: product.quantities
        }

        const itemIdx = newOrderItems.findIndex(i => i.productId === product.productId)
        if (itemIdx > 0) {
            newOrderItems[itemIdx].color.push(curColor)
            newOrderItems[itemIdx].quantities += product.quantities
        } else {
            const newItem: CreateOrderItem = {
                productId: product.productId,
                salePrice,
                quantities: product.quantities,
                color: [curColor],
            }
            newOrderItems.push(newItem)
        }
    })

    const total = subTotal + defaultShipFee

    const newOrder = await prismaClient.order.create({
        data: {
            billingAddress: order.billingAddress,
            shippingAddress: order.shippingAddress,
            shippingFee: defaultShipFee,
            subTotal,
            total,
            ownerId: userId,
            orderedProducts: {
                create: newOrderItems
            }
        },
    })

    const responseOrder = await santinizeOrder({ ...newOrder, ...newOrderItems }, true)
    return responseOrder
}

/**
 * @method delete
 * @param userId Get from cookies JWT
 * @param orderId req.query
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
    let token: JWT | SignedUserData | void;
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

    if (token.role !== 'admin') {
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
        case ApiMethod.POST:
            try {
                //Validattion
                const newOrderSchema = Yup.object(NewOrderSchemaValidate)

                const newOrder = await newOrderSchema.validate(req.body)

                //create Order include OrderItems
                const data = await createOrder(userId, newOrder)
                return res.status(200).json({ data, message: "New order created" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
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
