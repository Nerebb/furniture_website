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
    isPending?: boolean,
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

/**
 * @description santinize data output to match front-end
 * @param role JWT token
 * @param data from database
 * @param userId JWT token
 * @returns ResponseReview
 */
export function santinizeReview(role: Role, data: SantinizeReview, userId?: string): ResponseReview {
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
        isPending: role === 'admin' ? data.isPending : true,
    };
}

/**
 * @method POST
 * @description Create new product review
 * @param role JWT token
 * @param review req.body
 * @param userId JWT token
 * @access Login required
 * @return message
 */
export type NewReviewProps = Omit<ProductReview, 'id' | 'totalLike' | 'createdDate' | 'updatedAt' | 'ownerId' | 'isPending'>

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

/**
 * @method GET
 * @description Get reviews by filter/search
 * @param role JWT token
 * @param searchParams req.query - filter/search input
 * @param userId JWT token
 * @returns ResponseReview[]
 */
export async function getReviews(role: Role, searchParams: ReviewSearch, userId?: string) {
    let searchReviewParams: Prisma.ProductReviewWhereInput = {
        id: { in: searchParams.id },
        ownerId: searchParams.ownerId,
        productId: searchParams.productId,
        content: { contains: searchParams.content },
        rating: { gte: searchParams.rating },
        totalLike: { gte: searchParams.totalLike },
        createdDate: { gte: searchParams.createdDate },
        updatedAt: { gte: searchParams.updatedAt },
        isPending: role === 'admin' ? searchParams.isPending : false
    }

    if (searchParams.likedUsers && searchParams.likedUsers?.length > 0) {
        searchReviewParams = {
            ...searchReviewParams,
            likedUsers: { some: { id: { in: searchParams.likedUsers } } }
        }
    }

    const totalRecord = await prismaClient.productReview.count({
        where: searchReviewParams
    })

    if (searchParams.skip && searchParams.skip > totalRecord) throw new Error("")

    let orderBy: Prisma.ProductReviewOrderByWithAggregationInput = {};
    if (searchParams.filter && searchParams.sort) {
        orderBy[searchParams.filter] = searchParams.sort
    }

    const data = await prismaClient.productReview.findMany({
        where: searchReviewParams,
        include: productReviewIncludes,
        skip: searchParams.skip || 0,
        take: searchParams.limit || 4,
        orderBy,
    })

    if (!data.length) throw new Error("Product not found")

    const response = data.map(review => santinizeReview(role, review, userId))
    return { data: response, totalRecord }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | null;
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
