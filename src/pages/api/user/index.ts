//THIS ROUTE ONLY FOR ADMIN --- WHICH WILL BE REDIRECTED OR REFUSED BY MIDDLEWEAR


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { AllowedUserRelationFilter, AllowedUserSearch, SearchUserSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { Gender, Prisma, Role, User } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'

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
}
export async function getManyUsers({ ...props }: UserSearch & UserFilter) {
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
        take: props.limit
    })

    return data
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchUserSchemaValidate)
                const validated = await schema.validate(req.query)

                const data = await getManyUsers(validated)
                const totalUsers = await prismaClient.user.count()
                res.setHeader('content-range', JSON.stringify({ totalUsers }))
                return res.status(200).json({ data, message: "Get user success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.POST:
            try {
                return res.status(200).json({ message: "Update user succe" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        case ApiMethod.DELETE:
            try {
                const id = await isUUID.validate(req.query)
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}