// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { UserSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { ApiMethod, UserProfile } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT, getToken } from 'next-auth/jwt'
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from '../auth/customLogin'
import { Role, User } from '@prisma/client'
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
 * @method GET
 * @description Get one user profile
 * @param role JWT token
 * @param userId JWT token - if admin -> userId from req.query
 * @response UserProfile
 */
async function getUser(role: Role, userId: string): Promise<User | UserProfile> {
    const data = await prismaClient.user.findFirstOrThrow({
        where: { id: userId },
    })
    const response = responseUserProfile(role, data)
    return response
}

/**
 * @method POST
 * @description Update login user profile only
 * @param role JWT token
 * @param userId JWT token - if admin -> userId from req.query
 * @param data req.body - updated data
 * @access login required
 * @response res.body message:"Update complete"
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
                        role: data.role,
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
 * @method DELETE soft delete a user
 * @description using middleware mutate prismaClient.delete to .update (@/libs/prismadb)
 * @param userId JWT token - if admin -> userId from req.query
 * @response message
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
    let token: JWT | SignedUserData | null;
    let id: string;
    let role: Role = 'customer';
    try {
        token = await verifyToken(req)
        if (!token || !token.userId) throw new Error("Unauthorize user")
        if (token.role === 'admin') {
            id = await isUUID.validate(req.query.id)
        } else {
            id = token.userId
        }
        role = token.role
    } catch (error: any) {
        return res.status(405).json({ message: error.message || error })
    }

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getUser(role, id)
                return res.status(200).json({ message: "Get user success", data })
            } catch (error: any) {
                return res.status(400).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                const schema = Yup.object(UserSchemaValidate)
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
                const validatedField = await validateSchema()

                const data = await updateUser(role, id, { ...validatedField, birthDay: req.body.birthDay })
                return res.status(200).json({ data, message: "Update user success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message })
            }
        case ApiMethod.DELETE:
            try {
                await deleteUser(id)
                return res.status(200).json({ message: "Delete User successful" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
