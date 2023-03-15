// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { ProductSearchSchemaValidate } from '@/libs/schemaValitdate'
import { MediaGallery, Prisma, Product } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ProductCard = {
    id?: string,
    name?: Product['name']
    price?: Product['price']
    available?: Product['available']
    cateIds?: { id: number }[],
    roomIds?: { id: number }[]
    colors?: Product['JsonColor']
    rating?: number,
    totalSale?: number,
    ratedUsers?: number,
    creatorId?: string,
    imageUrl?: MediaGallery['imageUrl'][],
    createdDate?: Product['createdDate'],
    updatedDate?: Product['updatedAt'],
    totalProduct?: number,
}

export type ProductSearch = {
    limit?: number,
    skip?: number,
    rating?: number,
    price?: number,
    available?: boolean,
    name?: string,
    cateId?: number[],
    colorHex?: string[],
    roomId?: number[],
    createdDate?: Date,
    creatorName?: string,
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
                price: {
                    equals: props.price
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
            OrderItem: {
                select: {
                    quantities: true,
                }
            },
            image: {
                select: {
                    imageUrl: true,
                }
            },
            rating: {
                select: {
                    rating: true,
                }
            },
            _count: {
                select: {
                    rating: true,
                }
            },
        }

        const totalProduct = await prismaClient.product.count({
            where: searchProductParams.where
        })

        const data = await prismaClient.product.findMany({
            ...searchProductParams,
            include: searchProductIncludes,
            // skip: 0,
            // take: 100,
        })
        //Santinize Data
        let responseData: ProductCard[] = data.map(product => {
            //Rating
            const rating = Math.floor(product!.rating!.reduce((total, rate) => total + rate.rating, 0) / product!._count!.rating)

            //TotalSale
            const totalSale = product?.OrderItem?.reduce((total, sale) => total + sale.quantities, 0)
            return {
                id: product.id,
                name: product.name,
                available: product.available,
                cateIds: product.category,
                roomIds: product.room,
                colors: product.JsonColor,
                price: product.price,
                creatorId: product.creatorId,
                imageUrl: product?.image?.map(i => i.imageUrl),
                createdDate: product.createdDate,
                updatedDate: product.updatedAt,
                rating,
                ratedUsers: product?._count?.rating,
                totalSale,
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

        //Paginating
        const paginatedData = responseData.slice(props.skip || 0, (props.skip || 0) + props.limit!)

        return paginatedData
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
                const { limit, skip, name, price, available, creatorName, rating, cateId, colorHex, roomId, createdDate } = req.query
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
                    price: price ? parseInt(price as string) : undefined,
                    available: available ? Boolean(available) : false,
                    creatorName,
                    rating: rating ? parseInt(rating as string) : undefined,
                    cateId: typeof cateId === 'string' ? [parseInt(cateId)] : Array.isArray(cateId) ? cateId.map(i => parseInt(i)) : undefined,
                    colorHex: typeof colorHex === 'string' ? [colorHex] : Array.isArray(colorHex) ? colorHex.map(i => i.toString()) : undefined,
                    roomId: typeof roomId === 'string' ? [parseInt(roomId)] : Array.isArray(roomId) ? roomId.map(i => parseInt(i)) : undefined,
                    createdDate: createdDate ? new Date(createdDate as string) : undefined,
                }

                await ProductSearchSchemaValidate.validate(filterProduct)

                //Queries
                const data = await getProducts({ ...filterProduct })

                return res.status(200).json({ message: "Get product success", data })
            } catch (error: any) {
                return res.status(400).json({ message: error.message })
            }
        default:
            return res.status(500).json({ message: 'UNKNOWN EROR' })
    }
}
