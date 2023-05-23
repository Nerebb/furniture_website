// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { LoginSchemaValidate } from '@/libs/schemaValitdate'
import { Role } from '@prisma/client'
import { ApiMethod, Login } from '@types'
import { compare } from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT, getToken } from 'next-auth/jwt'
import * as Yup from 'yup'

type Data = {
    role?: Role,
    message?: string,
    access_token?: string,
}

export interface SignedUserData extends JwtPayload {
    userId: string,
    role: Role,
    provider: string,
}

export async function generateGuest(loginId: string) {
    const provider = `guest`
    const providerAccountId = loginId
    const password = `guest-${loginId}`
    let guestUser = await prismaClient.user.findFirst({
        where: { accounts: { some: { loginId, provider, providerAccountId, password } } },
        include: { accounts: true }
    })
    if (!guestUser) {
        guestUser = await prismaClient.user.create({
            data: {
                role: 'guest',
                accounts: {
                    create: {
                        loginId,
                        password,
                        provider,
                        providerAccountId,
                        type: 'credentials',
                    }
                }
            },
            include: { accounts: true }
        })
    }

    return guestUser
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
    let token: JWT | SignedUserData | null
    try {
        // Next-Auth
        token = await getToken({ req, secret: process.env.SECRET })
        if (token) return token

        // Guest account if dont have JWT Bearer
        if (!req.headers.authorization) {
            const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
            if (!ip || typeof ip !== 'string') throw new Error("Invalid client IP")
            const user = await generateGuest(ip)
            token = {
                provider: `guest`,
                role: user.role,
                userId: user.id,
            } satisfies SignedUserData
        } else {
            // JWT Bearer
            const access_token = JSON.parse(req.headers.authorization.toString().replace("Bearer ", "")) as string;
            try {
                const decode = jwt.verify(access_token, process.env.SECRET) as SignedUserData
                token = decode
            } catch (err: any) {
                if (err.name === "TokenExpiredError") {
                    throw new Error("Token expired, please login again")
                } else {
                    throw err
                }
            }
        }

        return token
    } catch (error) {
        throw error
    }
}

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
                return res.status(200).json({ role: user.role, access_token, message: "Credential login success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
