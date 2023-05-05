import prismaClient from '@/libs/prismaClient'
import { ShoppingCartCreateSchemaValidate, ShoppingCartDeleteSchemaValidate, ShoppingCartUpdateSchemaValidate } from '@/libs/schemaValitdate'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import * as Yup from 'yup'
import { getProductById } from '../products/[productId]'
import { Prisma } from '@prisma/client'

export type shoppingCartItem = {
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
    shoppingCartItem: shoppingCartItem[]
}

type Data = {
    data?: UserShoppingCart
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
 * @method GET
 * @param userId from JWT Token
 * @returns type UserShoppingCart
 */
export async function getShoppingCart(userId: string) {
    const data = await prismaClient.shoppingCart.findUniqueOrThrow({
        where: { ownerId: userId },
        include: shoppingCartIncludes
    })

    //SantinizeData
    const shoppingCartItem: shoppingCartItem[] = data.shoppingCartItem.map(i => ({
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
 * @method PUT
 * @description create new Shoppingcart
 * @param userId from JWT Token
 * @param req client request {productId,color,quantities} in query params
 * @returns message
 */
export async function createShoppingCart(userId: string, req: NextApiRequest) {
    //Validate request data: productId,color,quantities
    const schema = Yup.object(ShoppingCartCreateSchemaValidate)
    const { productId, color, quantities } = await schema.validate(req.query)

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
export async function updateShoppingCart(userId: string, req: NextApiRequest) {
    //Santinize request
    const schema = Yup.object(ShoppingCartUpdateSchemaValidate)

    const { cartItemId, color, quantities } = await schema.validate(req.query)

    const curCart = await getShoppingCart(userId)

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
 * @method DELETE - PERNAMENT
 * @param userId from JWT Token
 * @param cartItemId req.query
 * @returns message
 */
export async function deleteShoppingCart(userId: string, req: NextApiRequest) {
    const schema = Yup.object(ShoppingCartDeleteSchemaValidate)
    const { cartItemId } = await schema.validate(req.query)

    //Authorization
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
    // const { userId } = req.query //For testing

    const token = await getToken({
        req,
        secret: process.env.SECRET
    },)

    if (!token?.userId || !token) return res.status(400).json({ message: "Invalid user" }) //Already check in middleware - this just for userId is specified - no undefined

    const userId = token.userId

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getShoppingCart(userId as string)
                return res.status(200).json({ data, message: "Get shoppingcart product success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            try {
                await createShoppingCart(userId as string, req)
                return res.status(200).json({ message: "Create/Add to cart success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                await updateShoppingCart(userId as string, req)
                return res.status(200).json({ message: "Update product completed" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteShoppingCart(userId as string, req)
                return res.status(200).json({ message: "Product has been removed from cart" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid request method" })
    }
}

