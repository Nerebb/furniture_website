// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { isUUID } from '@/libs/schemaValitdate'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { ProductCard } from '../products'

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
    const data = await prismaClient.wishlist.findFirstOrThrow({
        where: { ownerId: { equals: loginId } },
        include: {
            products: {
                include: {
                    category: {
                        select: { id: true }
                    },
                    room: {
                        select: { id: true }
                    },
                    image: {
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

    let responseData: ProductCard[] = data.products.map(product => {
        return {
            id: product.id,
            name: product.name,
            available: product.available,
            description: product.description ?? undefined,
            cateIds: product.category,
            roomIds: product.room,
            colors: product.JsonColor as string[],
            price: product.price,
            creatorId: product.creatorId,
            imageUrl: product?.image?.map(i => i.imageUrl),
            createdDate: product.createdDate.toString(),
            updatedDate: product.updatedAt.toString(),
            avgRating: product.avgRating,
            ratedUsers: product.totalRating,
            totalSale: product.totalSale,
            totalProduct,
        }
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
    await prismaClient.wishlist.update({
        where: { ownerId: userId },
        data: {
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

    const token = await getToken({
        req,
        secret: process.env.SECRET
    },)

    if (!token?.userId || !token) return res.redirect('/login') //Already check in middleware - this just for userId is specified - no undefined

    const userId = token.userId

    let { productId } = req.query;

    if (productId) {
        try {
            productId = await isUUID.validate(req.query.productId)
        } catch (error: any) {
            return res.status(401).json({ message: error.message })
        }
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getWishList(userId as string)
                return res.status(200).json({ data, message: "Get User wishlist success" })
            } catch (error: any) {
                return res.status(406).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            try {
                await addToWishlist(userId, productId as string)
                return res.status(200).json({ message: "Add selected product to wishlist success" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteWishlistProduct(userId, productId as string)
                return res.status(200).json({ message: "Product has been removed from wishlist" })
            } catch (error: any) {
                console.log(error)
                return res.status(422).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid request method" })
    }
}
