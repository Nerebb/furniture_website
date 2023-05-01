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

//SantinizeDAta
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
 * @method GET
 * @description get product by Id
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
        totalRating: data.totalRating,
        totalSale: data.totalSale,
        createdDate: data.createdDate.toString(),
        updatedAt: data.updatedAt.toString(),
    }

    return response
}

/**
 * @method PUT
 * @description Update login user profile only
 * @isAdmin @allowed All
 * @isCreator only Description
 * @response res.body message:"Update complete"
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
 * @method DELETE
 * @description SoftDelete products - only Admin
 * @response res.body message:"Update complete"
*/
type deleteProduct = {
    userRole: Role
    productId: string,
}
export async function deleteProductById({ userRole, productId }: deleteProduct) {
    // if (userRole !== 'admin') throw Error("Unauthorize User")

    await prismaClient.product.delete({
        where: { id: productId }
    })
}

/**
 * @method PUT
 * @description Create new product - only Admin
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
    imageIds: number[],
    creatorId: string
}

export async function createProduct({ ...newProduct }: newProduct) {
    // if (userRole !== 'admin') throw Error("Unauthorize User")

    // if (!userId) throw Error("Invalid user please login again")

    // //SantinizeData
    // const schema = Yup.object(ProductCreateSchemaValidate)
    // const { name, description, price, available, creatorId, colors, cateIds, roomIds, imageIds } = await schema.validate(req.body)

    try {
        const data = await prismaClient.product.create({
            data: {
                name: newProduct.name,
                description: newProduct.description,
                available: newProduct.available,
                price: newProduct.price,
                creatorId: newProduct.creatorId,
                JsonColor: newProduct.colors?.map(id => ({ hex: id, label: GetColorName(id) })),
                cateIds: {
                    connect: newProduct.cateIds.map(i => ({ id: i })),
                },
                roomIds: {
                    connect: newProduct.roomIds.map(i => ({ id: i })),
                },
                imageIds: {
                    connect: newProduct.imageIds.map(i => ({ id: i }))
                }
            },
            include: ProductIncludesQuery
        })
        const response = {
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
            totalRating: data.totalRating,
            totalSale: data.totalSale,
            createdDate: data.createdDate.toString(),
            updatedAt: data.updatedAt.toString(),
        }
        return response
    } catch (error) {
        throw error
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let productId;
    try {
        productId = await isUUID.validate(req.query.productId)
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Invalid Product Id" })
    }
    const token = await getToken({ req, secret: process.env.SECRET })
    const userRole = token?.role ?? 'customer'
    const userId = token?.userId

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
                const validateSchema = async () => {
                    try {
                        const validated = await schema.validate(req.body)
                        return validated
                    } catch (err) {
                        try {
                            const validated = await schema.validate(JSON.parse(req.body))
                            return validated
                        } catch (error) {
                            throw error
                        }
                    }
                }
                const allowedField = await validateSchema()
                const data = await updateProductById({ userRole: 'admin', userId, updateProduct: { ...allowedField, id: productId } })

                return res.status(200).json({ data, message: 'Product has been updated' })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            try {
                const schema = Yup.object(ProductCreateSchemaValidate)
                const validateSchema = async () => {
                    try {
                        const validated = await schema.validate(req.body)
                        return validated
                    } catch (err) {
                        try {
                            const validated = await schema.validate(JSON.parse(req.body))
                            return validated
                        } catch (error) {
                            throw error
                        }
                    }
                }
                const validated = await validateSchema()
                const data = await createProduct(validated)

                return res.status(200).json({ data, message: "Product created" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductById({ userRole, productId })
                return res.status(200).json({ message: 'Product has been deleted' })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: 'Invalid Method' })
    }
}
