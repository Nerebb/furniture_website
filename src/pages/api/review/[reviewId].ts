// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { UpdateProductReviewSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { Prisma, Role } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT } from 'next-auth/jwt'
import * as Yup from 'yup'
import { ResponseReview, productReviewIncludes, santinizeReview } from '.'
import { SignedUserData, verifyToken } from '../auth/customLogin'

type Data = {
    data?: ResponseReview | ResponseReview[]
    message: string
}

/**
 * @method GET /api/review/:reviewId
 * @description Get one productReview by reviewId
 * @access everyone
 * @returns ResponseReview
 */
export async function getProductReviewById(role: Role, reviewId: string, userId?: string) {
    const data = await prismaClient.productReview.findUniqueOrThrow({
        where: { id: reviewId },
        include: productReviewIncludes
    })
    return santinizeReview(role, data, userId)
}

/**
 * @method PUT /api/review/:reviewId?userId
 * @description Update likes of product review Or update content of owned productReview
 * @param body {likedUser} || {id,ownerId,productId,content,rating}
 * @access login required - Only admin can access userId from req.query which replace ownerId
 * @return message
 */
export type UpdateReview = {
    id?: string
    content?: string
    rating?: number
    isPending?: boolean
}
export async function updateProductReview(role: Role, review: UpdateReview, userId?: string) {
    let prevRating;
    if (review.rating) {
        prevRating = await prismaClient.productReview.findUniqueOrThrow({
            where: { id: review.id },
            select: { rating: true }
        })
    }

    const data = await prismaClient.productReview.update({
        where: { id: review.id },
        data: {
            content: review.content,
            rating: review.rating,
            isPending: role === 'admin' ? review.isPending : undefined
        },
        include: productReviewIncludes
    })

    if (!data) throw new Error("Product review not found or User is not authorized")

    if (review.rating && prevRating?.rating) {
        //Update
        const product = await prismaClient.product.findUniqueOrThrow({
            where: { id: data.productId }
        })
        await prismaClient.product.update({
            where: { id: data.productId },
            data: {
                avgRating: Math.ceil(((product.avgRating * product.totalRating) - prevRating.rating + review.rating) / product.totalRating)
            }
        })
    }

    return santinizeReview(role, data, userId)
}

export async function updateReviewLike(reviewId: string, likeUser?: string) {
    if (!likeUser) throw new Error("Invalid user")
    const review = await prismaClient.productReview.findUniqueOrThrow({
        where: { id: reviewId },
        include: {
            likedUsers: {
                select: { id: true }
            }
        }
    })

    if (likeUser === review.ownerId) throw new Error("This review belongs to current User!")

    if (review.likedUsers.some(like => like.id === likeUser)) {
        await prismaClient.productReview.update({
            where: { id: reviewId },
            data: {
                totalLike: review.totalLike - 1,
                likedUsers: {
                    disconnect: { id: likeUser }
                }
            }
        })
    } else {
        await prismaClient.productReview.update({
            where: { id: reviewId },
            data: {
                totalLike: review.totalLike + 1,
                likedUsers: {
                    connect: { id: likeUser }
                }
            }
        })
    }
}

/**
 * @description delete pernament product review by reviewId
 * @param role JWT token
 * @param reviewId req.query
 * @param userId JWT token - if role === admin => userId from req.body
 * @access login required
 */
export async function deleteProductReviewById(role: Role, reviewId: string, userId?: string) {
    let deleteReviewParam: Prisma.ProductReviewWhereInput = {
        id: reviewId
    }

    if (role !== 'admin') deleteReviewParam.ownerId = userId

    const data = await prismaClient.productReview.deleteMany({
        where: deleteReviewParam
    })

    if (!data.count) throw new Error("Product review not found")
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)
    if (!token || !token.userId) return res.status(401).json({ message: "Invalid user" })
    const { reviewId } = await Yup.object({ reviewId: isUUID }).validate(req.query)

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getProductReviewById(token.role, reviewId, token.userId)
                return res.status(200).json({ data, message: "Get ProductReviewById success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetProductReviewById: Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                //Update user like the review or update user that owned the review
                let data;
                if (req.body.likedUser) {
                    await updateReviewLike(reviewId, token.userId)
                } else {
                    const schema = Yup.object(UpdateProductReviewSchemaValidate)
                    const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
                    const validated = await schema.validate(requestData)

                    data = await updateProductReview(token.role, validated, token.userId)
                }

                return res.status(200).json({ data, message: "Product review updated" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductReviewById(token.role, reviewId, token.userId)
                return res.status(200).json({ message: "Delete selected Product review success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetProductReviewById: Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" });
    }
}
