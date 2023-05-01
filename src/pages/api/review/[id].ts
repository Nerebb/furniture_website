// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateProductReviewSchemaValidate, UpdateProductReviewSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { ProductReview, Role } from '@prisma/client'
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

export async function getProductReviewById(role: Role, reviewId: string, userId?: string) {
    const data = await prismaClient.productReview.findUniqueOrThrow({
        where: { id: reviewId },
        include: productReviewIncludes
    })
    return santinizeReview(role, data, userId)
}

export async function deleteProductReviewById(role: Role, reviewId: string, userId?: string) {
    const data = await prismaClient.productReview.deleteMany({
        where: {
            id: reviewId,
            ownerId: userId
        }
    })
    if (!data.count) throw new Error("Product review not found")
}

/**
 * @method POST
 * @body review {id,ownerId,productId,content,rating}
 * @return message
 */
export type UpdateReview = {
    id?: string
    content?: string,
    rating?: number
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
            rating: review.rating
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

/**
 * @method POST
 * @body reviewId
 * @body likeUser
 * @return message
 */
export async function updateReviewLike(reviewId: string, likeUser?: string) {
    if (!likeUser) throw new Error("Something went wrong - try to login again!")
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | void;
    try {
        token = await verifyToken(req)
        if (!token || !token.userId) throw new Error("Unauthorize user")
    } catch (error: any) {
        token = {
            userId: '',
            role: 'customer',
            provider: "",
        }
    }
    const { id } = await Yup.object({ id: isUUID }).validate(req.query)

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getProductReviewById(token.role, id, token.userId)
                return res.status(200).json({ data, message: "Get ProductReviewById success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetProductReviewById: Unknown error" })
            }
        case ApiMethod.PUT:
            try {
                //Update user like the review or update user that owned the review
                let data;
                if (req.body.likedUser) {
                    const schema = Yup.object({ id: Yup.string().uuid("Invalid reviewId").required() })
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
                    await updateReviewLike(validated.id, token.userId)
                } else {
                    const schema = Yup.object(UpdateProductReviewSchemaValidate)
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
                    data = await updateProductReview(token.role, validated, token.userId)
                }

                return res.status(200).json({ data, message: "Product review updated" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                await deleteProductReviewById(token.role, id, token.userId)
                return res.status(200).json({ message: "Delete selected Product review success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "GetProductReviewById: Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" });
    }
}
