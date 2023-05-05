// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { LoginSchemaValidate } from '@/libs/schemaValitdate'
import { Role } from '@prisma/client'
import { ApiMethod, Login } from '@types'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT, getToken } from 'next-auth/jwt'
import * as Yup from 'yup'

type Data = {
    data?: any,
    message?: string,
    access_token?: string,
}

export interface SignedUserData extends JwtPayload {
    userId: string,
    role: Role,
    provider: string,
}

/**
 * @method POST
 * @body loginId, password
 * @returns JWT Token
 */
export async function credentialLogin({ loginId, password }: Partial<Login>) {
    const user = await prismaClient.user.findFirst({
        where: {
            deleted: null,
            accounts: {
                some: { loginId }
            }
        },
        include: {
            accounts: {
                where: { loginId }
            }
        }
    })

    if (!user) throw new Error('Invalid User or password')
    if (!password) throw new Error("Password missing")

    //checkPassword
    const checkPassword = await compare(password, user.accounts[0].password as string)
    if (!checkPassword) throw new Error('Password is incorrect')

    return user
}

export function generateToken(user: SignedUserData) {
    const access_token = jwt.sign(user, process.env.SECRET, { expiresIn: '30d' })
    return access_token
}

export async function verifyToken(req: NextApiRequest): Promise<JWT | SignedUserData | null> {
    try {
        const token = await getToken({ req, secret: process.env.SECRET })
        if (!token) throw new Error
        return token
    } catch (error) {
        if (!req.headers.authorization) throw error
        const token = JSON.parse(req.headers.authorization.toString().replace("Bearer ", "")) as string;
        try {
            const decode = jwt.verify(token, process.env.SECRET) as SignedUserData
            return decode
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired, please login again")
            } else {
                throw err
            }
        }
    }
}

// export async function verifySchema(value: any, options?: ValidateOptions<TContext>): Promise<ResolveFlags<TType, TFlags, TDefault>> {
//     try {
//         const validated = await schema.validate(value)
//         return validated
//     } catch (error) {
//         try {
//             const validated = await schema.validate(JSON.parse(value))
//             return validated
//         } catch (error) {
//             throw error
//         }
//     }
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.POST:
            try {
                const schema = Yup.object(LoginSchemaValidate)
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

                const user = await credentialLogin(validated)

                const access_token = generateToken({ userId: user.id, role: user.role, provider: user.accounts[0].provider })
                return res.status(200).json({ access_token, message: "Credential login success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
