// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { CreateProductReviewSchemaValidate, DeleteProductReviewSchemaValidate, SearchProductReviewSchemaValidate, isUUID } from '@/libs/schemaValitdate';
import { Prisma, ProductReview, Role } from '@prisma/client';
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT } from 'next-auth/jwt';
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from '../auth/customLogin';

export type ResponseReview = ProductReview & {
    name: string,
    nickName?: string,
    userCreatedDate: Date,
    isLiked: boolean,
}

export type ReviewSearch = {
    id?: string | string[],
    ownerId?: string,
    productId?: string,
    likedUsers?: string[],
    totalLike?: number,
    content?: string,
    rating?: number,
    createdDate?: Date,
    updatedAt?: Date,
    limit?: number,
    skip?: number,
    filter?: keyof Omit<ProductReview, ''>,
    sort?: 'asc' | 'desc'
}

type Data = {
    data?: ResponseReview | ResponseReview[]
    message: string
}

export const productReviewIncludes = {
    owner: {
        select: {
            name: true,
            nickName: true,
            createdDate: true,
        }
    },
    likedUsers: { select: { id: true } }
} satisfies Prisma.ProductReviewInclude

type SantinizeReview = {
    owner: {
        name: string | null;
        nickName: string | null;
        createdDate: Date;
    };
    likedUsers: {
        id: string;
    }[]
} & ProductReview

export function santinizeReview(role: Role, data: SantinizeReview, userId?: string): ResponseReview {
    switch (role) {
        case 'admin':
        default:
            return {
                id: data.id,
                content: data.content,
                productId: data.productId,
                rating: data.rating,
                ownerId: data.ownerId,
                name: data.owner.name ?? "",
                nickName: data.owner.nickName ?? undefined,
                userCreatedDate: data.owner.createdDate,
                totalLike: data.totalLike,
                createdDate: data.createdDate,
                updatedAt: data.updatedAt,
                isLiked: data.likedUsers.some(i => i.id === userId),
            };
    }
}

/**
 * @method PUT
 * @body review {content,rating,ownerId,productId}
 * @return message
 */
export type NewReviewProps = Omit<ProductReview, 'id' | 'totalLike' | 'createdDate' | 'updatedAt' | 'ownerId'>
export async function createProductReview(role: Role, review: NewReviewProps, userId?: string) {
    try {
        if (!userId) throw new Error("Unauthorize User")
        const orderItem = await prismaClient.orderItem.findMany({
            where: {
                productId: review.productId,
                order: { ownerId: userId }
            }
        })
        if (!orderItem || orderItem.length <= 0) throw new Error("User haven't purchased product")

        const data = await prismaClient.productReview.create({
            data: {
                content: review.content,
                rating: review.rating,
                totalLike: 0,
                owner: {
                    connect: { id: userId }
                },
                product: {
                    connect: { id: review.productId }
                }
            },
            include: productReviewIncludes
        })

        //Update productDetail
        const product = await prismaClient.product.findUniqueOrThrow({
            where: { id: review.productId }
        })


        const update = await prismaClient.product.update({
            where: { id: review.productId },
            data: {
                totalRating: product.totalRating + 1,
                totalComments: product.totalComments + 1,
                avgRating: Math.ceil((product.avgRating * product.totalRating + review.rating) / (product.totalRating + 1))
            }
        })

        return santinizeReview(role, data, userId)
    } catch (error: any) {
        if (error.code === 'P2002') throw new Error("Review already exist")
        throw error
    }
}

export async function getReviews(role: Role, searchParams: ReviewSearch, userId?: string) {
    const searchReviewParams = {
        id: { in: searchParams.id },
        ownerId: searchParams.ownerId,
        productId: searchParams.productId,
        content: { contains: searchParams.content },
        rating: { gte: searchParams.rating },
        totalLike: { gte: searchParams.totalLike },
        likedUsers: { some: { id: { in: searchParams.likedUsers } } },
        createdDate: { gte: searchParams.createdDate },
        updatedAt: { gte: searchParams.updatedAt },
    } satisfies Prisma.ProductReviewWhereInput

    let orderBy: Prisma.ProductReviewOrderByWithAggregationInput = {};
    if (searchParams.filter && searchParams.sort) {
        orderBy[searchParams.filter] = searchParams.sort
    }

    const data = await prismaClient.productReview.findMany({
        where: searchReviewParams,
        include: productReviewIncludes,
        take: searchParams.limit || 0,
        orderBy,
    })

    if (!data.length) throw new Error("Product not found")
    const totalRecord = await prismaClient.productReview.count({
        where: searchReviewParams
    })
    const response = data.map(review => santinizeReview(role, review, userId))
    return { data: response, totalRecord }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | void;
    try {
        token = await verifyToken(req)
        if (!token || !token.userId) throw new Error("Switch to catch")
    } catch (error: any) {
        token = {
            userId: '',
            role: 'customer',
            provider: "",
        }
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchProductReviewSchemaValidate)
                const validated = await schema.validate(req.query)
                const { data, totalRecord } = await getReviews(token.role, validated, token.userId)
                res.setHeader('content-range', JSON.stringify({ totalRecord }))
                return res.status(200).json({ data, message: "Get reiviews success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown GetReviews error" })
            }
        case ApiMethod.POST:
            try {
                const schema = Yup.object(CreateProductReviewSchemaValidate)
                const validateSchema = async () => {
                    try {
                        const validated = await schema.validate(req.body)
                        return validated
                    } catch (error) {
                        try {
                            const validated = await schema.validate(JSON.parse(req.body))
                            return validated
                        } catch (error) {
                            throw error
                        }
                    }
                }
                const validated = await validateSchema()

                const data = await createProductReview(token.role, validated, token.userId)
                return res.status(200).json({ data, message: "Product review created" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                if (token.role !== 'admin') return res.status(405).json({ message: "Unauthorize user" })
                const schema = Yup.object(DeleteProductReviewSchemaValidate)
                const { id } = await schema.validate(req.query)
                const data = await prismaClient.productReview.deleteMany({
                    where: { id: { in: id } }
                })
                if (!data.count) throw new Error("Review not found")
                return res.status(200).json({ message: "Reviews deleted success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown DeleteReviews error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" });
    }
}
