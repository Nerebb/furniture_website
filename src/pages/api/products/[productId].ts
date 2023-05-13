// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { isUUID, ProductCreateSchemaValidate, ProductUpdateSchemaValidate } from '@/libs/schemaValitdate'
import { Prisma, Role } from '@prisma/client'
import { ApiMethod } from '@types'
import { GetColorName } from 'hex-color-to-color-name'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import * as Yup from 'yup'
import { ProductCard } from '.'
import { verifyToken } from '../auth/customLogin'

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

const ProductIncludesQuery = {
    cateIds: {
        select: { id: true }
    },
    roomIds: {
        select: { id: true }
    },
    creator: {
        select: {
            name: true,
            nickName: true,
        }
    },
    imageIds: true,
    reviews: true
} satisfies Prisma.ProductInclude

/**
 * @method GET /api/products/:productId
 * @description Get one ProductDetail by id
 * @return ProductDetail
*/
export async function getProductById(id: string): Promise<ProductDetail> {
    const data = await prismaClient.product.findUniqueOrThrow({
        where: { id },
        include: ProductIncludesQuery
    })

    //SantinizeData
    const response: ProductDetail = {
        id: data.id,
        name: data.name,
        available: data.available,
        price: data.price,
        description: data.description ?? undefined,
        commentIds: data.reviews.map(i => ({ id: i.id })),
        totalComments: data.totalComments,
        colors: data.JsonColor as string[],
        cateIds: data.cateIds.map(i => i.id),
        roomIds: data.roomIds.map(i => i.id),
        creatorId: data.creatorId,
        image: data.imageIds,
        avgRating: data.avgRating,
        isFeatureProduct: data.isFeatureProduct,
        totalRating: data.totalRating,
        totalSale: data.totalSale,
        createdDate: data.createdDate.toString(),
        updatedAt: data.updatedAt.toString(),
    }

    return response
}

/**
 * @method PUT /api/products/:productId
 * @description Update product by id
 * @body {name,description,price,available,isFeatureProduct,colors,cateIds,roomIds,imageUrls,creatorId,avgRating}
 * @access Admin can update all fields, Creator - only update description
 * @response message
*/
type AllowedProductField = {
    name?: string,
    description?: string,
    price?: number,
    available?: number,
    isFeatureProduct?: boolean,
    colors?: string[],
    cateIds?: number[],
    roomIds?: number[],
    imageUrls?: number[],
    creatorId?: string
    avgRating?: number,
}
type updateProduct = {
    userId?: string
    userRole: Role
    updateProduct: AllowedProductField & { id: string }
}

export async function updateProductById({ userId, userRole, updateProduct }: updateProduct) {
    switch (userRole) {
        case 'admin':
            try {
                const data = await prismaClient.product.update({
                    where: { id: updateProduct.id },
                    data: {
                        name: updateProduct.name,
                        description: updateProduct.description,
                        price: updateProduct.price,
                        available: updateProduct.available,
                        isFeatureProduct: updateProduct.isFeatureProduct,
                        JsonColor: updateProduct.colors,
                        cateIds: { connect: updateProduct.cateIds?.map(i => ({ id: i })) },
                        roomIds: { connect: updateProduct.roomIds?.map(i => ({ id: i })) },
                        creatorId: updateProduct.creatorId,
                        avgRating: updateProduct.avgRating,
                    },
                    include: ProductIncludesQuery
                })

                const response: ProductDetail = {
                    id: data.id,
                    name: data.name,
                    available: data.available,
                    price: data.price,
                    description: data.description ?? undefined,
                    commentIds: data.reviews.map(i => ({ id: i.id })),
                    totalComments: data.totalComments,
                    colors: data.JsonColor as string[],
                    cateIds: data.cateIds.map(i => i.id),
                    roomIds: data.roomIds.map(i => i.id),
                    creatorId: data.creatorId,
                    image: data.imageIds,
                    avgRating: data.avgRating,
                    isFeatureProduct: data.isFeatureProduct,
                    totalRating: data.totalRating,
                    totalSale: data.totalSale,
                    createdDate: data.createdDate.toString(),
                    updatedAt: data.updatedAt.toString(),
                }
                return response;
            } catch (error) {
                throw error
            }
        case 'creator':
            try {
                if (!userId) throw Error('Invalid user')
                if (!updateProduct.description) throw new Error("Updated description not found")
                const data = await prismaClient.product.updateMany({
                    where: { id: updateProduct.id, deleted: null },
                    data: {
                        description: updateProduct.description
                    }
                })
                if (!data.count) throw new Error("Product not found")
                return;
            } catch (error) {
                throw error
            }
        default:
            throw new Error("UpdateProduct: Unauthorize User");
    }
}

/**
 * @method POST /api/products/:productId
 * @description Create new product
 * @body {name,description,price,available,isFeatureProduct,colors,cateIds,roomIds,imageIds,creatorId}
 * @access admin only
 * @response message
*/
type newProduct = {
    name: string,
    description?: string,
    price?: number,
    available?: number,
    isFeatureProduct?: boolean,
    colors: string[],
    cateIds: number[],
    roomIds: number[],
    imageIds?: number[],
    creatorId: string
} & { role: Role }

export async function createProduct({ role, ...newProduct }: newProduct) {
    if (role !== 'admin') throw Error("Unauthorize User")

    try {
        const data = await prismaClient.product.create({
            data: {
                name: newProduct.name,
                description: newProduct.description,
                available: newProduct.available,
                price: newProduct.price,
                creatorId: newProduct.creatorId,
                JsonColor: newProduct.colors,
                cateIds: {
                    connect: newProduct.cateIds.map(i => ({ id: i })),
                },
                roomIds: {
                    connect: newProduct.roomIds.map(i => ({ id: i })),
                },
                // imageIds: {
                //     connect: newProduct.imageIds.map(i => ({ id: i }))
                // }
            },
            include: ProductIncludesQuery
        })
        const response = {
            id: data.id,
            name: data.name,
            available: data.available,
            price: data.price,
            description: data.description ?? undefined,
            totalComments: data.totalComments,
            colors: data.JsonColor as string[],
            cateIds: data.cateIds.map(i => i.id),
            roomIds: data.roomIds.map(i => i.id),
            creatorId: data.creatorId,
            avgRating: data.avgRating,
            isFeatureProduct: data.isFeatureProduct,
            totalRating: data.totalRating,
            totalSale: data.totalSale,
            createdDate: data.createdDate.toString(),
            updatedAt: data.updatedAt.toString(),
            totalProduct: 1,
        } satisfies ProductCard
        return response
    } catch (error) {
        throw error
    }
}

/**
 * @method DELETE /api/products/:productId
 * @description SoftDelete one product by id
 * @access admin only
 * @response message
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



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)
    if (!token || !token.userId) return res.status(401).json({ message: "Invalid user" })

    let productId;
    try {
        productId = await isUUID.validate(req.query.productId)
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Invalid Product Id" })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getProductById(productId)
                return res.status(200).json({ data, message: 'Get product by id success' })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                const schema = Yup.object(ProductUpdateSchemaValidate)
                const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
                const allowedField = await schema.validate(requestData)

                const data = await updateProductById({ userRole: token.role, userId: token.userId, updateProduct: { ...allowedField, id: productId } })

                return res.status(200).json({ data, message: 'Product has been updated' })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductById({ userRole: token.role, productId })
                return res.status(200).json({ message: 'Product has been deleted' })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: 'Invalid Method' })
    }
}
