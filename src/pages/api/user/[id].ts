// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { UserSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { ApiMethod, UserProfile } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT, getToken } from 'next-auth/jwt'
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from '../auth/customLogin'
import { Prisma, Role, User } from '@prisma/client'
type Data = {
    data?: UserProfile | User
    message?: any
}

function responseUserProfile(role: Role, data: User): UserProfile | User {
    switch (role) {
        case 'admin':
            return data
        default:
            return {
                id: data.id,
                address: data.address ?? undefined,
                nickName: data.nickName ?? undefined,
                role: data.role,
                phoneNumber: data.phoneNumber ?? undefined,
                image: data.image ?? undefined,
                birthDay: data.birthDay?.toString() ?? undefined, //FormatType yyyy-MM-dd
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                gender: data.gender,
            }
    }
}

/**
 * @method GET /api/user/:userId
 * @description Get one user profile
 * @access Only admin can access userId in req.query - others get userId from JWT token
 * @return UserProfile
 */
async function getUser(role: Role, userId: string): Promise<User | UserProfile> {
    const data = await prismaClient.user.findFirstOrThrow({
        where: { id: userId },
    })
    const response = responseUserProfile(role, data)
    return response
}

/**
 * @method PUT /api/user/:id
 * @description Update login user profile only
 * @body everyone - {name,nickName,address,email,gender,phoneNumber,birthDay}
 *       Admin -    {emailVerified,userVerified,deleted}
 * @access Only admin can access id in req.query - others get id from JWT token
 * @return res.body message:"Update complete"
*/
async function updateUser(role: Role, userId: string, data: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile | User> {
    try {
        switch (role) {
            case 'admin':
                const updateUser = await prismaClient.user.update({
                    where: { id: userId },
                    data: {
                        name: data.name,
                        nickName: data.nickName,
                        address: data.address,
                        email: data.email,
                        gender: data.gender,
                        role: data.role,
                        phoneNumber: data.phoneNumber,
                        birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
                        emailVerified: data.emailVerified ? new Date() : null,
                        userVerified: data.userVerified ? new Date() : null,
                        deleted: data.deleted ? new Date() : null
                    }
                })
                return responseUserProfile(role, updateUser)
            default:
                const updateOwnerProfile = await prismaClient.user.update({
                    where: { id: userId },
                    data: {
                        name: data.name,
                        nickName: data.nickName,
                        address: data.address,
                        email: data.email,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
                    }
                })

                return responseUserProfile(role, updateOwnerProfile)
        }
    } catch (error: any) {
        throw error
    }
}

/**
 * @method DELETE
 * @description soft delete owned account
 * @access Login user only
 * @return message
*/
async function deleteUser(userId: string) {
    await prismaClient.user.delete({
        where: { id: userId },
    })
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req)
    console.log("🚀 ~ file: [id].ts:117 ~ token:", token)
    if (!token || !token.userId) return res.status(401).json({ message: "Invalid user" })

    let userId = token.userId;
    if (token.role === 'admin') {
        try {
            userId = await isUUID.validate(req.query.id)
        } catch (error: any) {
            return res.status(400).json({ message: "AdminGetUser: Invalid userId" })
        }
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getUser(token.role, userId)
                return res.status(200).json({ message: "Get user success", data })
            } catch (error: any) {
                return res.status(400).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                const schema = Yup.object(UserSchemaValidate)
                const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
                const validated = await schema.validate(requestData)

                const data = await updateUser(token.role, userId, { ...validated, birthDay: req.body.birthDay })
                return res.status(200).json({ data, message: "Update user success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message })
            }
        case ApiMethod.DELETE:
            try {
                if (token.role === 'guest') return res.status(401).json({ message: "Invalid user" })
                await deleteUser(userId)
                return res.status(200).json({ message: "Delete User successful" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
