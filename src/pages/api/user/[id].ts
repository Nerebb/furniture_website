// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { isUUID } from '@/libs/schemaValitdate'
import { excludeField } from '@/libs/utils/excludeField'
import { ApiMethod, UserProfile } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
//Prisma -> types schema
type Data = {
    data?: UserProfile
    message?: any
}

/**
 * @method GET :CRUDMethod.READ
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
        birthDay: data.user.birthDay ?? undefined,
        name: data.user.name ?? undefined,
        email: data.user.email ?? undefined,
        gender: data.user.gender,
    }

    return responseData
}

/**
 * @method POST :CRUDMethod.UPDATE
 * @description Update login user profile only
 * @allowed { name, loginId, nickName, address, email, gender, phoneNumber, birthDay, wishList, purchased }
 * @response res.body message:"Update complete"
*/
async function updateUser(id: string, data: UserProfile): Promise<void> {
    try {
        //Destructure req.body
        const { name, nickName, address, email, gender, phoneNumber, birthDay } = data

        //SoftDelete problem: prisma.update {where: finds unique arg but deleted:false is not unique}
        await prismaClient.user.update(
            {
                where: { id: id as string },
                data: {
                    name, nickName, address, email, gender, phoneNumber, birthDay,
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
                return res.status(422).json({ message: error.name })
            }
        case ApiMethod.PUT:
            try {
                const { birthDay } = req.body
                if (birthDay) req.body.birthDay = new Date(birthDay)
                await updateUser(id as string, req.body)
                return res.status(200).json({ message: "Update user success" })
            } catch (error: any) {
                return res.status(422).json({ message: error.message })
            }
        case ApiMethod.DELETE:
            try {
                await deleteUser(id as string)
                return res.status(200).json({ message: "Delete User successful" })
            } catch (error: any) {
                return res.status(401).json({ message: `${error.meta.target}: ${error.meta.cause}` || error.name })
            }
        default:
            return res.status(500).json({ message: "Invalid Method" })
    }
}
