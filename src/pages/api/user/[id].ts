// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { UserSchemaValidate, isUUID } from '@/libs/schemaValitdate'
import { ApiMethod, UserProfile } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
type Data = {
    data?: UserProfile
    message?: any
}

/**
 * @method GET
 * @description Get login user profile
 * @response res.body userProfile
 */
async function getUser(id: string): Promise<UserProfile> {
    const data = await prismaClient.account.findFirstOrThrow(
        {
            where: { userId: id },
            include: {
                user: true,
            }
        }
    )
    // data.user.birthDay = data.user.birthDay?.getDate()

    const responseData: UserProfile = {
        id: data.user.id,
        address: data.user.address ?? undefined,
        nickName: data.user.nickName ?? undefined,
        role: data.user.role,
        phoneNumber: data.user.phoneNumber ?? undefined,
        image: data.user.image ?? undefined,
        birthDay: data.user.birthDay?.toString() ?? undefined, //FormatType yyyy-MM-dd
        name: data.user.name ?? undefined,
        email: data.user.email ?? undefined,
        gender: data.user.gender,
    }

    return responseData
}

/**
 * @method POST
 * @description Update login user profile only
 * @allowed { name, loginId, nickName, address, email, gender, phoneNumber, birthDay, wishList, purchased }
 * @response res.body message:"Update complete"
*/
async function updateUser(id: string, data: Omit<UserProfile, 'id' | 'role'>): Promise<void> {

    try {
        await prismaClient.user.update(
            {
                where: { id },
                data: {
                    ...data,
                    birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
                }
            }
        )
    } catch (error: any) {
        throw error
    }
}

/**
 * @method DELETE: CRUDMethod.DELETE - SoftDelete
 * @description using middleware mutate prismaClient.delete to .update (@/libs/prismadb)
 * @response res.body message:"Delete User successful"
*/
async function deleteUser(id: string) {
    await prismaClient.user.delete({
        where: { id: id as string },
    })
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    /**
     * @params '/api/user/:id'
     * @request req.query.id User have login with active session, session.id matches userId
     */
    const { id } = req.query

    // Check validId
    try {
        await isUUID.validate(id)
    } catch (err: any) {
        return res.status(401).json({ message: err.errors })
    }

    //Response
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await getUser(id as string) as UserProfile //Prisma User types
                return res.status(200).json({ message: "Get user success", data }) //Prisma User --- UserProfile
            } catch (error: any) {
                return res.status(400).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                // const { birthDay } = req.body
                const schema = Yup.object(UserSchemaValidate)
                const validatedField = await schema.validate(req.body)

                await updateUser(id as string, { ...validatedField, birthDay: req.body.birthDay }) //Yup date mutate is wrong!!!
                return res.status(200).json({ message: "Update user success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message })
            }
        case ApiMethod.DELETE:
            try {
                await deleteUser(id as string)
                return res.status(200).json({ message: "Delete User successful" })
            } catch (error: any) {
                return res.status(401).json({ message: `${error.meta.target}: ${error.meta.cause}` || error.name })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
