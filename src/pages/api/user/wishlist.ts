// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { isUUID } from '@/libs/schemaValitdate'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT, getToken } from 'next-auth/jwt'
import { ProductCard } from '../products'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../auth/customLogin'

type Data = {
    data?: ProductCard[]
    message?: string
}


/**
 * @method GET
 * @param loginId Get from cookies JWT
 * @returns ProductCard[]
 */
export async function getWishList(loginId: string) {
    const data = await prismaClient.wishlist.findFirst({
        where: { ownerId: { equals: loginId } },
        include: {
            products: {
                include: {
                    cateIds: {
                        select: { id: true }
                    },
                    roomIds: {
                        select: { id: true }
                    },
                    imageIds: {
                        select: {
                            imageUrl: true,
                        }
                    },
                }
            }
        }
    })

    const totalProduct = await prismaClient.wishlist.count({
        where: { ownerId: { equals: loginId } },
    })
    if (!data) return []
    let responseData = data.products.map(product => {
        return {
            id: product.id,
            name: product.name,
            available: product.available,
            description: product.description ?? undefined,
            cateIds: product.cateIds.map(i => i.id),
            roomIds: product.roomIds.map(i => i.id),
            colors: product.JsonColor as string[],
            price: product.price,
            creatorId: product.creatorId,
            imageUrl: product?.imageIds?.map(i => i.imageUrl),
            createdDate: product.createdDate.toString(),
            updatedAt: product.updatedAt.toString(),
            avgRating: product.avgRating,
            totalRating: product.totalRating,
            totalSale: product.totalSale,
            totalComments: product.totalComments,
            totalProduct,
        } satisfies ProductCard
    })
    return responseData
}

/**
 * @method POST
 * @description Add ONE product to wishlist
 * @param loginId Get from cookies JWT
 * @param productId req.query
 * @returns Message: "Add product comepleted"
 */
export async function addToWishlist(userId: string, productId: string) {
    await prismaClient.wishlist.upsert({
        where: { ownerId: userId },
        update: {
            products: {
                connect: { id: productId }
            }
        },
        create: {
            user: {
                connect: { id: userId }
            },
            products: {
                connect: { id: productId }
            }
        }
    })
}

/**
 * @method DELETE //Pernament
 * @description Remove ONE product from owned wishlist
 * @param loginId Get from cookies JWT
 * @param productId req.query
 * @retuns Message
 */

export async function deleteWishlistProduct(userId: string, productId: string) {
    await prismaClient.wishlist.update({
        where: { ownerId: userId },
        data: {
            products: {
                disconnect: { id: productId }
            }
        }
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let userId: string;
    try {
        const token = await verifyToken(req)
        if (!token || !token.userId) throw new Error("Unauthorize user")
        userId = token.userId
    } catch (error: any) {
        return res.status(400).json({ message: error.message })
    }

    let productId;
    try {
        productId = await isUUID.notRequired().validate(req.query.productId)
    } catch (error: any) {
        return res.status(401).json({ message: error.message })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getWishList(userId as string)
                return res.status(200).json({ data, message: "Get User wishlist success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
        case ApiMethod.POST:
            try {
                await addToWishlist(userId, productId as string)
                return res.status(200).json({ message: "Add selected product to wishlist success" })
            } catch (error: any) {
                console.log("🚀 ~ file: wishlist.ts:152 ~ error:", error)
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteWishlistProduct(userId, productId as string)
                return res.status(200).json({ message: "Product has been removed from wishlist" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid request method" })
    }
}
