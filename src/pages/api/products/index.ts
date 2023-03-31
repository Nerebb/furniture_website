// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { ProductSearchSchemaValidate } from '@/libs/schemaValitdate'
import { MediaGallery, Prisma, Product, Status } from '@prisma/client'
import { ApiMethod } from '@types'
import * as Yup from 'yup'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ProductCard = {
    id: string,
    name: Product['name']
    price: Product['price']
    description?: string,
    available: Product['available']
    cateIds?: { id: number }[],
    roomIds?: { id: number }[]
    colors: string[],
    avgRating: number,
    totalSale: number,
    ratedUsers: number,
    creatorId: string,
    imageUrl?: MediaGallery['imageUrl'][],
    createdDate: string,
    updatedDate: string,
    totalProduct: number,
}

export type ProductSearch = {
    limit?: number,
    skip?: number,
    rating?: number,
    fromPrice?: number,
    toPrice?: number,
    available?: boolean,
    name?: string,
    cateId?: number[],
    colorHex?: string[],
    roomId?: number[],
    createdDate?: Date,
    creatorName?: string,
    isFeatureProduct?: boolean,
}

type Data = {
    data?: ProductCard | ProductCard[],
    message: string,
}
/**
 * @method GET
 * @query type ProductSearch
 * @returns type ProductCard
 */
export async function getProducts({ ...props }: ProductSearch): Promise<ProductCard[]> {
    try {
        let creatorId;
        if (props.creatorName) {
            creatorId = await prismaClient.user.findFirst({
                where: {
                    nickName: {
                        contains: props.creatorName
                    },
                },
                select: {
                    id: true,
                }
            })
        }

        const searchProductParams: Prisma.ProductFindManyArgs = {
            where: {
                deleted: null,
                isFeatureProduct: props.isFeatureProduct || undefined,
                price: {
                    gte: props.fromPrice,
                    lte: props.toPrice
                },
                available: {
                    gt: props.available ? 0 : undefined //Boolean Type
                },
                name: {
                    contains: props.name
                },
                category: {
                    some: { id: { in: props.cateId } }
                },
                room: {
                    some: { id: { in: props.roomId } }
                },
                JsonColor: {
                    array_contains: props.colorHex
                },
                avgRating: { gte: props.rating },
                createdDate: props.createdDate
            }
        }

        const searchProductIncludes: Prisma.ProductInclude =
        {
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
            image: {
                select: {
                    imageUrl: true,
                }
            },
        }

        const totalProduct = await prismaClient.product.count({
            where: searchProductParams.where
        })

        const data = await prismaClient.product.findMany({
            ...searchProductParams,
            include: searchProductIncludes,
            skip: props.skip || 0,
            take: props.limit || 12,
        })

        //Santinize Data
        let responseData: ProductCard[] = data.map(product => {
            return {
                id: product.id,
                name: product.name,
                available: product.available,
                description: product.description ?? undefined,
                cateIds: product.category?.map(i => ({ id: i.id })),
                roomIds: product.room?.map(i => ({ id: i.id })),
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

        //Categories
        if (props.cateId?.length) {
            responseData = responseData.filter(product => props.cateId?.every(i => product.cateIds?.map(v => v.id).includes(i)))
        }
        if (props.roomId?.length) {
            responseData = responseData.filter(product => props.roomId?.every(i => product.roomIds?.map(v => v.id).includes(i)))
        }

        return responseData
    } catch (error) {
        console.log("GetProduct", error)
        throw error
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const { limit, skip, name, fromPrice, toPrice, available, creatorName, rating, cateId, colorHex, roomId, createdDate } = req.query
                //MiddleWare validation and santinization
                if (name && Array.isArray(name)) throw new Error("Name: Array not allowed")

                if (creatorName && Array.isArray(creatorName)) throw new Error("CreatorName: Array not allowed")

                /**
                 * @SantinizeData
                 * @description turn data to correct prisma form for queries - data received from req.query: string | string [] | undefine
                 * @typeString queryUrl example : /products?cateId=2 => req.query.cateId = 2
                 * @typeStringArray queryUrl example: /products?cateId=2&cateId=3 =>  req.query.cateId = [2,3]
                 */
                const filterProduct: ProductSearch = {
                    limit: limit ? parseInt(limit as string) : 12,
                    skip: skip ? parseInt(skip as string) : undefined,
                    name,
                    fromPrice: fromPrice ? parseInt(fromPrice as string) : undefined,
                    toPrice: toPrice ? parseInt(toPrice as string) : undefined,
                    available: available ? Boolean(available) : false,
                    creatorName,
                    rating: rating ? parseInt(rating as string) : undefined,
                    cateId: typeof cateId === 'string' ? [parseInt(cateId)] : Array.isArray(cateId) ? cateId.map(i => parseInt(i)) : undefined,
                    colorHex: typeof colorHex === 'string' ? [colorHex] : Array.isArray(colorHex) ? colorHex.map(i => i.toString()) : undefined,
                    roomId: typeof roomId === 'string' ? [parseInt(roomId)] : Array.isArray(roomId) ? roomId.map(i => parseInt(i)) : undefined,
                    createdDate: createdDate ? new Date(createdDate as string) : undefined,
                }

                const YupValidator: Yup.ObjectSchema<ProductSearch> = Yup.object(ProductSearchSchemaValidate).typeError("Invalid Request - request.query must be object type")

                const validateResult = await YupValidator.validate(filterProduct)

                //Queries
                const data = await getProducts({ ...validateResult })

                return res.status(200).json({ message: "Get product success", data })
            } catch (error: any) {
                return res.status(400).json({ message: error.message })
            }
        default:
            return res.status(405).json({ message: 'UNKNOWN EROR' })
    }
}
