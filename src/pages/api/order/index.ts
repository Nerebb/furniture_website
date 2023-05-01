// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { OrderSearchSchemaValidate } from '@/libs/schemaValitdate';
import { Order, OrderItem, Prisma, Role, Status, User } from '@prisma/client';
import { ApiMethod, JsonColor } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT } from 'next-auth/jwt';
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from '../auth/customLogin';

type OrderInclude = {
    _count?: Prisma.OrderCountOutputType | undefined;
    owner?: User | undefined;
    orderedProducts?: OrderItem[] | undefined;
}

export type CreateOrderItem = Omit<Prisma.OrderItemCreateInput, 'order'> & {
    color: JsonColor[]
}

export type NewOrderItem = {
    productId: string,
    color: string,
    quantities: number
}

export type NewOrder = {
    billingAddress: string;
    shippingAddress: string;
    shippingFee?: number;
    products: NewOrderItem[]
}

export type OrderedItem = {
    id: string
    name: string
    salePrice: number
    quantities: number
    color: string
    orderId: string
    productId: string
}

export type ResponseOrder = {
    id: string
    subTotal: string
    shippingFee: number
    total: string
    billingAddress: string
    shippingAddress: string
    status: Status
    ownerId: string
    createdDate: string
    updatedAt: string
    orderedProductIds: string[]
    orderedProductDetail?: OrderedItem[]
}


export type OrderSearch = {
    id?: string | string[],
    subTotal?: number,
    shippingFee?: number,
    total?: number,
    billingAddress?: string,
    shippingAddress?: string,
    status?: Status
    ownerId?: string | string[],
    limit?: number
    filter?: keyof Order
    sort?: "asc" | "desc"
    skip?: number
    createdDate?: Date,
    updatedAt?: Date
}

type Data = {
    data?: ResponseOrder | ResponseOrder[],
    message: string
}

export const orderIncludesParams = {
    orderedProducts: true
} satisfies Prisma.OrderInclude


export async function santinizeOrder(data: Order & OrderInclude, getDetail: boolean = false): Promise<ResponseOrder> {
    if (!data.orderedProducts) throw new Error("Products not found")
    let santinizedOrder: ResponseOrder = {
        id: data.id,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        ownerId: data.ownerId,
        shippingFee: data.shippingFee,
        status: data.status,
        subTotal: data.subTotal.toString(),
        total: data.total.toString(),
        updatedAt: data.updatedAt.toString(),
        createdDate: data.createdDate.toString(),
        orderedProductIds: data.orderedProducts.map(i => i.id || "Not found"),
    }

    if (getDetail) {
        const productIds = data.orderedProducts.map(i => i.productId)
        const productDetails = await prismaClient.product.findMany({
            where: { id: { in: productIds } }
        })
        let orderItems: OrderedItem[] = []
        data.orderedProducts.forEach(product => {
            const colors = product.color as Array<{ id?: string, quantities?: number }>
            colors.forEach((color, idx) => {
                if (!color.id || !color.quantities) throw new Error(`Product ${product.id} have invalid color, index: ${idx}`)
                const lineItem = {
                    id: product.id,
                    name: productDetails.find(i => i.id === product.productId)?.name || "Unknown",
                    orderId: product.orderId,
                    salePrice: product.salePrice,
                    productId: product.productId,
                    color: color.id,
                    quantities: color.quantities,
                } satisfies OrderedItem
                orderItems.push(lineItem)
            })
        })
        return { ...santinizedOrder, orderedProductDetail: orderItems }
    }
    return santinizedOrder
}

export async function getOrders(role: Role, userId: string, searchParams: OrderSearch) {
    let orderSearchParams: Prisma.OrderWhereInput = {
        subTotal: { gte: searchParams.subTotal },
        shippingFee: { gte: searchParams.shippingFee },
        total: { gte: searchParams.total },
        billingAddress: { contains: searchParams.billingAddress },
        shippingAddress: { contains: searchParams.shippingAddress },
        status: searchParams.status,
        createdDate: { gte: searchParams.createdDate },
        updatedAt: { gte: searchParams.updatedAt }
    }

    if (role === 'admin') {
        orderSearchParams.id = { in: searchParams.id }
        orderSearchParams.ownerId = { in: searchParams.ownerId }
    } else {
        orderSearchParams.ownerId = userId
    }

    let orderBy: Prisma.OrderOrderByWithAggregationInput = {}
    if (searchParams.filter && searchParams.sort) orderBy[searchParams.filter] = searchParams.sort

    const data = await prismaClient.order.findMany({
        where: orderSearchParams,
        include: orderIncludesParams,
        orderBy,
        take: searchParams.limit
    })

    const totalRecord = await prismaClient.order.count({
        where: orderSearchParams,
    })

    let response: ResponseOrder[] = [];

    data.forEach(async (order) => {
        const santinizedOrder = await santinizeOrder(order)
        response.push(santinizedOrder)
    })

    return { response, totalRecord }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | void;
    try {
        token = await verifyToken(req)
        if (!token || !token.userId) throw new Error
    } catch (error: any) {
        return res.status(404).json({ message: error.message || "Unauthorize user" })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(OrderSearchSchemaValidate)
                const validated = await schema.validate(req.query)
                const { response: data, totalRecord } = await getOrders(token.role, token.userId, validated)
                res.setHeader("content-range", JSON.stringify({ totalRecord }))
                return res.status(200).json({ data, message: "Get orders success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetOrder: Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
