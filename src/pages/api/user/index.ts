//THIS ROUTE ONLY FOR ADMIN --- WHICH WILL BE REDIRECTED OR REFUSED BY MIDDLEWEAR


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { AllowedUserRelationFilter, AllowedUserSearch, SearchUserSchemaValidate } from '@/libs/schemaValitdate'
import { Gender, Prisma, Role, User } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
import { verifyToken } from '../auth/customLogin'

type Data = {
    data?: User | User[]
    message?: string
}

type UserSearch = {
    id?: string | string[],
    name?: string,
    nickName?: string,
    address?: string,
    email?: string,
    gender?: Gender,
    role?: Role,
    phoneNumber?: string,
    birthDay?: Date,
    createdDate?: Date,
    updatedAt?: Date,
    userVerified?: Date,
    emailVerified?: Date,
    deleted?: Date,
}

export type UserRelation = {
    productsReviewed?: Prisma.ProductReviewOrderByRelationAggregateInput
    reviewLiked?: Prisma.ProductReviewOrderByRelationAggregateInput
    writedContents?: Prisma.ProductOrderByRelationAggregateInput
    wishlist?: Prisma.WishlistOrderByWithRelationInput
    shoppingCart?: Prisma.ShoppingCartOrderByWithRelationInput
    carts?: Prisma.OrderOrderByRelationAggregateInput
    accounts?: Prisma.AccountOrderByRelationAggregateInput
}

type UserFilter = {
    filter?: string
    sort?: "asc" | "desc"
    limit?: number
    skip?: number
}

/**
 * @method GET /api/user?id=<string>&name=<string>&nickName=<string>&address=<string>&email=<string>&gender=<Gender>&role=<Role>&phoneNumber=<string>&birthDay=<Date>&createdDate=<Date>&updatedAt=<Date>&userVerified=<Date>&emailVerified=<Date>&deleted=<Date>
 * @description get users by filter/search
 * @access Only admin
 * @return User[]
 */
export async function getUsers({ ...props }: UserSearch & UserFilter) {
    let orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (props.filter && props.sort) {
        if (AllowedUserRelationFilter.includes(props.filter as keyof UserRelation)) {
            orderBy[props.filter as keyof UserRelation] = { _count: props.sort }
        } else if (AllowedUserSearch.includes(props.filter as keyof User)) {
            orderBy[props.filter as keyof User] = props.sort
        }
    }

    const userSearchParams = {
        id: { in: props.id },
        name: { contains: props.name },
        nickName: { contains: props.nickName },
        email: { contains: props.email },
        gender: props.gender,
        role: props.role,
        createdDate: { gte: props.createdDate },
        updatedAt: { gte: props.updatedAt },
        userVerified: { gte: props.userVerified },
        emailVerified: { gte: props.emailVerified },
        deleted: { gte: props.deleted }
    } satisfies Prisma.UserWhereInput

    const data = await prismaClient.user.findMany({
        where: userSearchParams,
        orderBy,
        skip: props.skip,
        take: props.limit,
    })

    return data
}

/**
 * @method DELETE /api/user?id=<string|string[]>
 * @description soft delete user
 * @access Only admin
 * @return message
 */
export async function deleteUsers(ids: string | string[]) {
    const data = await prismaClient.user.deleteMany({
        where: { id: { in: ids } }
    })

    if (!data.count) throw new Error("No users found")
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)
    if (!token || !token.userId || token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchUserSchemaValidate)
                const validated = await schema.validate(req.query)

                const data = await getUsers(validated)
                const totalRecord = await prismaClient.user.count()
                res.setHeader('content-range', JSON.stringify({ totalRecord }))
                return res.status(200).json({ data, message: "Get user success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                const schema = Yup.object({
                    id: Yup.lazy((value) => {
                        switch (typeof value) {
                            case 'string':
                                return Yup.string().uuid().required()
                            default:
                                return Yup.array().of(Yup.string().uuid().required()).required()
                        }
                    })
                })
                const { id } = await schema.validate(req.query)

                await deleteUsers(id)
                return res.status(200).json({ message: "Delete users success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
