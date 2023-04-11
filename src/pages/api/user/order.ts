// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { NewOrderSchemaValidate, ShoppingCartCreateSchemaValidate, UserOrderSchemaValidate } from '@/libs/schemaValitdate';
import { Order, OrderItem, Prisma, Status } from '@prisma/client';
import { ApiMethod } from '@types';
import { GetColorName } from 'hex-color-to-color-name';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import * as Yup from 'yup';

export type OrderedItem = {
    id: string
    salePrice: number
    totalQuantities: number
    colors: { id: string, quantities: number }[]
    orderId: string
    name: string
}

export type newOrder = Omit<Order, "createdDate" | "updatedAt" | "id" | "subTotal" | "total" | "shippingFee" | "status">
    & {
        subTotal: number
        total: number
        orderItems: newOrderItem[]
    }

export type newOrderItem = {
    productId: string,
    color: string,
    quantities: number
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
export async function getUserOrders(userId: string, limit: number | undefined, skip: number | undefined, status: Status | undefined) {
    const orders = await prismaClient.order.findMany({
        where: { ownerId: userId, status },
        include: {
            orderedProducts: { select: { id: true, } }
        },
        take: limit,
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
    console.log("🚀 ~ file: order.ts:83 ~ getOrderedProducts ~ data:", data)

    const productIds = data.map(i => i.productId)

    const productDetails = await prismaClient.product.findMany({
        where: { id: { in: productIds } }
    })
    console.log("🚀 ~ file: order.ts:90 ~ getOrderedProducts ~ productDetails:", productDetails)

    const responseData: OrderedItem[] = data.map(product => ({
        id: product.id,
        salePrice: product.salePrice,
        totalQuantities: product.quantities,
        colors: product.color as Array<{ id: string, quantities: number }>,
        orderId: product.orderId,
        name: productDetails.find(i => i.id === product.productId)?.name || "Unknown",
    }))

    return responseData
}

/**
 * @method PUT
 * @param query type Order
 * @param req.body type OrderItem
 * @return message
 */

export async function createOrder({ ...order }: newOrder) {

    //Mutate Data shoppingCart :color:string > color:{id,qty}
    type newOrderItem = Omit<OrderItem, "id" | "createdDate" | "updatedAt" | "color" | "orderId"> & {
        color: { id: string, quantities: number }[]
    }
    const defaultShipFee = 20000
    const productDb = await prismaClient.product.findMany({
        where: {
            id: { in: order.orderItems.map(i => i.productId) },
            deleted: null,
        }
    })

    let subTotal = 0;

    const newOrderItems: newOrderItem[] = []

    order.orderItems.forEach(product => {
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
            const newItem: newOrderItem = {
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
            ownerId: order.ownerId,
            orderedProducts: {
                create: newOrderItems
            }
        }
    })
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
    //For testing api route
    const { userId } = req.query
    if (typeof userId !== 'string') throw new Error("Invalid UserId")

    // const token = await getToken({
    //     req,
    //     secret: process.env.SECRET
    // },)
    // if (!token?.userId || !token) return res.status(401).redirect('/login').json({ message: "Unauthorize User redirect to login page" })

    // const userId = token.userId

    const schema = Yup.object(UserOrderSchemaValidate)

    switch (req.method) {
        case ApiMethod.GET:
            try {
                //Validation
                const { orderId, limit, skip, status } = await schema.validate(req.query)

                async function switchGetMethod() {
                    userId
                    if (orderId) return await getOrderedProducts(orderId)
                    return await getUserOrders(userId as string, limit, skip, status)
                }

                const data = await switchGetMethod()

                return res.status(200).json({ data, message: "Get user Order success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                //Validattion
                const newOrderSchema = Yup.object(NewOrderSchemaValidate)

                const newOrder = await newOrderSchema.validate(req.body)

                //create Order include OrderItems
                const data = await createOrder({ ...newOrder, ownerId: userId })
                return res.status(200).json({ message: "New order created" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                //Validation
                const { orderId } = await schema.validate(req.query)
                if (!orderId) throw new Error("Invalid orderId")

                await cancelUserOrder(userId, orderId)
                return res.status(200).json({ message: "Order has been canceled by User" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(400).json({ message: 'Invalid method' })
    }
}
