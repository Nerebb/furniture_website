// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { isUUID, ProductCreateSchemaValidate } from '@/libs/schemaValitdate'
import { Role } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import * as Yup from 'yup'
import { ProductCard } from '.'

type Data = {
    data?: ProductDetail
    message?: any
}

export type ProductDetail = Omit<ProductCard, 'totalProduct'> & {
    totalComments: number,
    commentIds: {
        id: string;
    }[],
    image: { id: number, imageUrl: string }[]
}

export type NewProduct = {
    name: string,
    description?: string,
    price?: number,
    available?: number,
    creatorId: string,
    colors?: string[],
    cateIds?: { id: number }[],
    roomIds?: { id: number }[],
    imageUrls?: { id: number }[],
}

/**
 * @method GET
 * @description get product by Id
*/
export async function getProductById(id: string): Promise<ProductDetail> {
    const data = await prismaClient.product.findUniqueOrThrow({
        where: { id },
        include: {
            category: {
                select: { id: true }
            },
            room: {
                select: { id: true }
            },
            creator: {
                select: {
                    name: true,
                    nickName: true,
                }
            },
            image: true,
            comments: {
                select: {
                    id: true,
                }
            }
        }
    })

    //SantinizeData
    const response: ProductDetail = {
        id: data.id,
        name: data.name,
        available: data.available,
        price: data.price,
        description: data.description ?? undefined,
        commentIds: data.comments,
        totalComments: data.totalComments,
        cateIds: data.category,
        colors: data.JsonColor as string[],
        creatorId: data.creatorId,
        image: data.image,
        avgRating: data.avgRating,
        ratedUsers: data.totalRating,
        totalSale: data.totalSale,
        createdDate: data.createdDate.toString(),
        updatedDate: data.updatedAt.toString(),
    }

    return response
}

/**
 * @method POST
 * @description Update login user profile only
 * @isAdmin @allowed All
 * @isCreator only Description
 * @response res.body message:"Update complete"
*/
type updateProduct = {
    userId?: string
    userRole: Role
    productId: string,
    req: NextApiRequest
}

export async function updateProductById({ userId, userRole, productId, req }: updateProduct) {
    const { available, creatorId, description, name, price, JsonCategory, JsonColor, JsonImage, JsonRooms } = req.body
    let updateContent;
    switch (userRole) {
        case 'admin':
            updateContent = { available, creatorId, description, name, price, JsonCategory, JsonColor, JsonImage, JsonRooms }
            await prismaClient.product.updateMany({
                where: { id: productId as string },
                data: { ...updateContent }
            })
            return;
        case 'creator':
            updateContent = { description }
            if (!userId) throw Error('Invalid user')
            await prismaClient.product.updateMany({
                where: { id: productId as string, creatorId: userId, deleted: null },
                data: { ...updateContent }
            })
            return;
        default:
            throw new Error("UpdateProduct: Unknown error");
    }
}

/**
 * @method DELETE
 * @description SoftDelete products - only Admin
 * @response res.body message:"Update complete"
*/
type deleteProduct = {
    userRole: Role
    productId: string,
}
export async function deleteProductById({ userRole, productId }: deleteProduct) {
    if (userRole !== 'admin') throw Error("Unauthorize User")

    await prismaClient.product.delete({
        where: { id: productId }
    })
}

/**
 * @method PUT
 * @description Create new product - only Admin
 * @response message
*/
type createProduct = {
    userRole: Role
    userId?: string
    req: NextApiRequest
}
export async function createProduct({ userRole, userId, req }: createProduct) {
    if (userRole !== 'admin') throw Error("Unauthorize User")
    // const { name, description, price, available, creatorId, colors, cateIds, roomIds, imageUrl } = req.body

    if (!userId) throw Error("Invalid user please login again")

    //SantinizeData
    const schema = Yup.object(ProductCreateSchemaValidate)
    const { name, description, price, available, creatorId, colors, cateIds, roomIds, imageUrl } = await schema.validate(req.body)
    try {
        await prismaClient.product.create({
            data: {
                name,
                description,
                available,
                price,
                creatorId,
                JsonColor: colors,
                category: {
                    connect: cateIds,
                },
                room: {
                    connect: roomIds,
                },
                image: {
                    connect: imageUrl
                }
            }
        })
        return { message: "Product created" }
    } catch (error) {
        throw error
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { productId } = req.query
    // Check validId
    try {
        await isUUID.validate(productId)
    } catch (err: any) {
        return res.status(401).json({ message: err.message })
    }

    const session = await getSession({ req })
    const userRole = session?.user.role ?? 'customer'
    const userId = session?.id

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getProductById(productId as string)
                return res.status(200).json({ data, message: 'Get product by id success' })
            } catch (error: any) {
                return res.status(406).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                await updateProductById({ userRole, userId, productId: productId as string, req })

                const data = await getProductById(productId as string)
                return res.status(200).json({ data, message: 'Product has been updated' })
            } catch (error: any) {
                return res.status(406).json({ message: error.message })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductById({ userRole, productId: productId as string })
                return res.status(200).json({ message: 'Product has been deleted' })
            } catch (error: any) {
                return res.status(406).json({ message: error.message })
            }
        case ApiMethod.POST:
            try {
                await createProduct({ userId, userRole, req })
            } catch (error: any) {
                return res.status(406).json({ message: error.message })
            }
        default:
            return res.status(500).json({ message: 'BAD REQUEST' })
    }
}
