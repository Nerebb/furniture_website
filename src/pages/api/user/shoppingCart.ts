import prismaClient from '@/libs/prismaClient'
import { ShoppingCartCreateSchemaValidate, ShoppingCartDeleteSchemaValidate, ShoppingCartUpdateSchemaValidate } from '@/libs/schemaValitdate'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import * as Yup from 'yup'
import { getProductById } from '../products/[productId]'
import { Prisma } from '@prisma/client'
import { NewOrderItem } from '../order'
import { verifyToken } from '../auth/customLogin'

type ShoppingItem = {
    productId: string
    color: string
    quantities: number
}

type UpdateShoppingItem = {
    cartItemId: string,
    color?: string,
    quantities?: number,
}

export type ShoppingCartItem = {
    id: string
    color: string
    quantities: number
    productId: string
    name: string
    price: number
    available: number
    avgRating: number
    totalRating: number
    totalComments: number
    totalSale: number
    imageUrl: string[]
}

export type UserShoppingCart = {
    id: string
    subTotal: string
    shoppingCartItem: ShoppingCartItem[]
}

type Data = {
    data?: UserShoppingCart | []
    message?: string
}

//DataBase Queries
const shoppingCartIncludes = {
    shoppingCartItem: {
        select: {
            id: true,
            color: true,
            quantities: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    available: true,
                    avgRating: true,
                    totalRating: true,
                    totalComments: true,
                    totalSale: true,
                    imageIds: true,
                }
            }
        },
    }
} satisfies Prisma.ShoppingCartInclude

/**
 * @method GET /api/user/shoppingCart
 * @access Login user
 * @return  UserShoppingCart
 */
export async function getShoppingCart(userId: string) {
    const data = await prismaClient.shoppingCart.findUnique({
        where: { ownerId: userId },
        include: shoppingCartIncludes
    })
    if (!data) return
    //SantinizeData
    const shoppingCartItem: ShoppingCartItem[] = data.shoppingCartItem.map(i => ({
        id: i.id,
        color: i.color,
        quantities: i.quantities,
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price ?? 0,
        available: i.product.available ?? 0,
        avgRating: i.product.avgRating,
        totalRating: i.product.totalRating,
        totalComments: i.product.totalComments,
        totalSale: i.product.totalSale,
        imageUrl: i.product.imageIds.map(i => i.imageUrl)
    }))

    return {
        id: data.id,
        subTotal: data.subTotal.toString(),
        shoppingCartItem,
    }
}

/**
 * @method PUT /api/user/shoppingCart
 * @description add new product to owned Shoppingcart
 * @param req client request {productId,color,quantities} in query params
 * @access Login user
 * @returns message
 */
export async function addShoppingCartItem(userId: string, { productId, color, quantities }: ShoppingItem) {
    //Check productId
    const chosenItem = await getProductById(productId)
    if (!chosenItem) throw new Error("Product not found")

    //Process queries data
    if (color && !chosenItem.colors?.includes(color)) throw new Error("Invalid product color")
    if (quantities && (quantities >= chosenItem.available)) throw new Error("Chosen product stock not meet requirements")
    const curProductPrice = ((quantities || 1) * (chosenItem.price || 1))

    //Find or create shoppingcart - Manipulate upsert(which is update or create)
    const curCart = await prismaClient.shoppingCart.upsert({
        where: { ownerId: userId },
        update: {},//Found then update none
        create: {
            subTotal: 0,
            ownerId: userId,
        },
        include: shoppingCartIncludes
    })

    //if cart already have chosenProduct Throw error
    if (curCart.shoppingCartItem.some(i => (i.product.id === productId) && (i.color === color))) throw new Error("Product already in cart")

    //if cart dont have chosenProduct
    const newSubTotal = Number(curCart.subTotal) + curProductPrice

    const cartItemPromise = await prismaClient.shoppingCartItem.create({
        data: {
            color,
            quantities: quantities || 1,
            ShoppingCart: {
                connectOrCreate: {
                    where: { ownerId: userId },
                    create: {
                        subTotal: newSubTotal,
                        owner: {
                            connect: { id: userId }
                        }
                    }
                }
            },
            product: { connect: { id: productId } }
        }
    })

    const cartPromise = await prismaClient.shoppingCart.update({
        where: { ownerId: userId },
        data: {
            subTotal: newSubTotal,
        },
    })
}


/**
 * @method POST
 * @param userId from JWT Token
 * @param req request from client
 */
export async function updateShoppingCart(userId: string, { cartItemId, color, quantities }: UpdateShoppingItem) {
    //Santinize request
    const curCart = await getShoppingCart(userId)
    if (!curCart) throw new Error("ShoppingCart not found")

    const chosenItem = curCart.shoppingCartItem.find(cartItem => cartItem.id === cartItemId)
    if (!chosenItem) throw new Error("Product not found")

    if (color) {
        const chosenProduct = await prismaClient.product.findUniqueOrThrow({
            where: { id: chosenItem.productId }
        })
        const productColors = chosenProduct.JsonColor as string[]
        if (!productColors.includes(color)) throw new Error("Invalid product color")
    }

    if (quantities) {
        const newSubTotal = parseInt(curCart.subTotal)
            - (chosenItem.quantities * chosenItem.price)
            + (quantities * chosenItem.price)

        await prismaClient.shoppingCart.update({
            where: { ownerId: userId },
            data: {
                subTotal: newSubTotal
            }
        })
    }

    await prismaClient.shoppingCartItem.update({
        where: { id: cartItemId },
        data: {
            color,
            quantities
        }
    })
}

/**
 * @method DELETE /api/user/shoppingCart?cartItemId=<string>
 * @description Delete one item in owned shopping cart by CartItemId
 * @returns message
 */
export async function deleteShoppingCartItem(userId: string, cartItemId: string) {
    const curCart = await prismaClient.shoppingCart.findUniqueOrThrow({
        where: { ownerId: userId },
        select: {
            subTotal: true,
            shoppingCartItem: {
                where: { id: cartItemId },
                select: {
                    quantities: true,
                    product: { select: { price: true } }
                }
            }
        }
    })

    //Calculate subTotal
    const newSubTotal = Number(curCart.subTotal) - (curCart.shoppingCartItem[0].quantities * curCart.shoppingCartItem[0].product.price)

    await prismaClient.shoppingCartItem.delete({
        where: { id: cartItemId }
    })

    await prismaClient.shoppingCart.update({
        where: { ownerId: userId },
        data: {
            subTotal: newSubTotal
        }
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)

    if (!token?.userId || !token) return res.status(401).json({ message: "Invalid user" })

    const userId = token.userId

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getShoppingCart(userId)
                return res.status(200).json({ data, message: "Get shoppingcart product success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            try {
                //Validate request data: productId,color,quantities
                const schema = Yup.object(ShoppingCartCreateSchemaValidate)
                const validated = await schema.validate(req.body)

                await addShoppingCartItem(userId, validated)
                return res.status(200).json({ message: "Create/Add to cart success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                //Santinize request
                const schema = Yup.object(ShoppingCartUpdateSchemaValidate)
                const validated = await schema.validate(req.body)
                await updateShoppingCart(userId, validated)
                return res.status(200).json({ message: "Update product completed" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                const schema = Yup.object(ShoppingCartDeleteSchemaValidate)
                const { cartItemId } = await schema.validate(req.query)

                await deleteShoppingCartItem(userId, cartItemId)
                return res.status(200).json({ message: "Product has been removed from cart" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid request method" })
    }
}

