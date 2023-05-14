// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { ProductCreateSchemaValidate, ProductSearchSchemaValidate } from '@/libs/schemaValitdate'
import { MediaGallery, Prisma, Product, Role } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
import { verifyToken } from '../auth/customLogin'
import { createProduct } from './[productId]'

export type ProductCard = {
    id: string,
    name: Product['name']
    price: Product['price']
    description?: string,
    available: Product['available']
    cateIds?: number[],
    roomIds?: number[]
    colors: string[],
    avgRating: number,
    creatorId: string,
    imageUrl?: MediaGallery['imageUrl'][],
    isFeatureProduct: boolean,

    createdDate: string,
    updatedAt: string,

    totalProduct: number,
    totalSale: number,
    totalRating: number,
    totalComments: number,
}

export type ProductSearch = {
    id?: string | string[],
    limit?: number,
    skip?: number,
    rating?: number,
    fromPrice?: number,
    toPrice?: number,
    available?: boolean,
    name?: string,
    cateId?: number | number[],
    colorHex?: string[],
    roomId?: number | number[],
    createdDate?: Date,
    creatorName?: string,
    isFeatureProduct?: boolean,
    filter?: keyof Omit<ProductCard, 'totalProduct'>,
    sort?: 'asc' | 'desc'
}

type Data = {
    data?: ProductCard | ProductCard[],
    message: string,
}
/**
 * @method GET /api/products?id=<productId>&id=<productId>&limit=<number>&skip=<number>&rating=<number>&fromPrice=<number>&toPrice=<number>&available=<boolean>&name=<string>&cateId=<number|number[]>&colorHex=<string[]>&roomId=<number|number[]>&createdDate=<Date>&isFeaturedProduct=<boolean>&filter=keyof ProductTable&sort=<'asc' | 'desc'>
 * @description get Products witch filter/search params
 * @param role JWT token
 * @param props searchParams of product
 * @returns ProductCard[]
 */
export async function getProducts(role: Role, props: ProductSearch): Promise<ProductCard[]> {
    try {
        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        if (props.sort && props.filter) {
            switch (props.filter) {
                case 'imageUrl':
                    orderBy['imageIds'] = { _count: props.sort }
                    break;
                case 'cateIds':
                    orderBy['cateIds'] = { _count: props.sort }
                    break;
                case 'roomIds':
                    orderBy['roomIds'] = { _count: props.sort }
                    break;
                case 'colors':
                    orderBy['JsonColor'] = props.sort
                    break;
                default:
                    orderBy[props.filter] = props.sort
            }
        }

        const searchProductParams: Prisma.ProductWhereInput = {
            id: { in: props.id },
            isFeatureProduct: props.isFeatureProduct || undefined,
            price: {
                gte: props.fromPrice,
                lte: props.toPrice
            },
            available: {
                gte: props.available ? 0 : undefined //Boolean Type
            },
            name: {
                contains: props.name
            },
            JsonColor: {
                array_contains: props.colorHex
            },
            avgRating: { gte: props.rating },
            createdDate: props.createdDate
        }

        if (props.cateId) searchProductParams.cateIds = { some: { id: { in: props.cateId } } }
        if (props.roomId) searchProductParams.roomIds = { some: { id: { in: props.roomId } } }
        if (role !== 'admin') searchProductParams.deleted = null

        const searchProductIncludes: Prisma.ProductInclude = {
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
            imageIds: {
                select: {
                    imageUrl: true,
                }
            },
        }

        const totalProduct = await prismaClient.product.count({
            where: searchProductParams
        })

        const data = await prismaClient.product.findMany({
            where: searchProductParams,
            include: searchProductIncludes,
            skip: props.skip || 0,
            take: props.limit || 12,
            orderBy,
        })

        //Santinize Data
        let responseData: ProductCard[] = data.map(product => {
            return {
                id: product.id,
                name: product.name,
                available: product.available,
                description: product.description ?? undefined,
                cateIds: product.cateIds?.map(i => i.id),
                roomIds: product.roomIds?.map(i => i.id),
                colors: product.JsonColor as string[],
                price: product.price,
                creatorId: product.creatorId,
                imageUrl: product?.imageIds?.map(i => i.imageUrl),
                createdDate: product.createdDate.toString(),
                updatedAt: product.updatedAt.toString(),
                avgRating: product.avgRating,
                isFeatureProduct: product.isFeatureProduct,
                totalRating: product.totalRating,
                totalSale: product.totalSale,
                totalProduct,
                totalComments: product.totalComments
            }
        })
        return responseData
    } catch (error) {
        throw error
    }
}

/**
 * @method DELETE /api/product?id=<productId>&id=<productId>&id=<productId>
 * @description SoftDelete manyProducts depends on productId
 * @return message
 * @access role === 'admin'
 */

export async function deleteProducts(ids: string[]) {
    const data = await prismaClient.product.deleteMany({
        where: { id: { in: ids } }
    })

    if (!data.count) throw new Error("No product found")
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)
    if (!token || !token.userId) return res.status(401).json({ message: "Invalid user" })

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(ProductSearchSchemaValidate).typeError("Request data not found or Invalid")
                //SantinizeData
                if (req.query.colorHex && typeof req.query.colorHex === 'string') req.query.colorHex = [req.query.colorHex]
                if (req.query.cateId && typeof req.query.cateId === 'string') req.query.cateId = [req.query.cateId]
                if (req.query.roomId && typeof req.query.roomId === 'string') req.query.roomId = [req.query.roomId]

                const validateResult = await schema.validate(req.query)

                //Queries
                const data = await getProducts(token.role, validateResult)
                return res.status(200).json({ data, message: "Get product success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            if (token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })
            try {
                const schema = Yup.object(ProductCreateSchemaValidate)
                const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
                const validated = await schema.validate(requestData)

                const data = await createProduct({ role: token.role, ...validated })

                return res.status(200).json({ data, message: "Product created" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            if (token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })
            try {
                const schema = Yup.object({ id: Yup.array().of(Yup.string().uuid().required()).required() }).typeError("Request query must be Array type")

                const { id } = await schema.validate(req.query)

                await deleteProducts(id)

                return res.status(200).json({ message: "Delete many product success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: 'Invalid method' })
    }
}
