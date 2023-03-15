// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiMethod } from '@types'
import prismaClient from '@/libs/prismaClient'
import { excludeField } from '@/libs/utils/excludeField'
import { isUUID } from '@/libs/schemaValitdate'
import { Prisma, Product, Role } from '@prisma/client'
import { getSession } from 'next-auth/react'


export type ReqProduct = Omit<Product,
    | 'id'
    | 'deleted'
> & {
    JsonColor: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
    JsonCategory: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
    JsonRooms: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
    JsonImage: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
}

type Data = {
    data?: Omit<Product, 'deleted'>
    message?: any
}

/**
 * @method GET
 * @description get product by Id
*/
export async function getProductById(id: string) {
    const data = await prismaClient.product.findFirstOrThrow({
        where: { id }
    })
    const removeDataField = excludeField(data, ['deleted'])
    return removeDataField
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
    const { available, creatorId, description, name, price, JsonCategory, JsonColor, JsonImage, JsonRooms } = req.body as ReqProduct
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
            return;
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
    req: NextApiRequest
}
export async function deleteProductById({ userRole, productId, req }: deleteProduct) {
    if (userRole !== 'admin') throw Error("Unauthorize User")

    await prismaClient.product.delete({
        where: { id: productId }
    })
}

/**
 * @method CREATE
 * @description Create new product - only Admin
 * @response res.body message:"Update complete"
*/
type createProduct = {
    userRole: Role
    req: NextApiRequest
}
export async function createProduct({ userRole, req }: createProduct) {
    if (userRole !== 'admin') throw Error("Unauthorize User")
    const { name, description, price, available, creatorId, JsonColor, JsonCategory, JsonRooms, JsonImage } = req.body as ReqProduct

    if (!name || !description || !price || !available || !creatorId) throw Error("Missing required field")

    await prismaClient.product.create({
        data: {
            name, description, price, available, creatorId, JsonColor, JsonCategory, JsonRooms, JsonImage
        }
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { id } = req.query
    // Check validId
    try {
        await isUUID.validate(id)
    } catch (err: any) {
        console.log("🚀 ~ file: [id].ts:125 ~ err:", err)
        return res.status(401).json({ message: err.errors })
    }

    const session = await getSession({ req })
    const userRole = session?.user.role ?? 'customer'
    const userId = session?.id

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getProductById(id as string)
                return res.status(200).json({ data, message: 'Get product by id success' })
            } catch (error: any) {
                return res.status(406).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                await updateProductById({ userRole, userId, productId: id as string, req })

                const data = await getProductById(id as string)
                return res.status(200).json({ data, message: 'Product has been updated' })
            } catch (error: any) {
                return res.status(406).json({ message: error.name })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductById({ userRole, productId: id as string, req })
                return res.status(200).json({ message: 'Product has been deleted' })
            } catch (error: any) {
                return res.status(406).json({ message: `${error.meta.target}: ${error.meta.cause}` || error.name || error })
            }
        case ApiMethod.POST:
            try {
                await createProduct({ userRole, req })
            } catch (error: any) {
                return res.status(406).json({ message: error.name || error })
            }
        default:
            return res.status(500).json({ message: 'BAD REQUEST' })
    }
}
