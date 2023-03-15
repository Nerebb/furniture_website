// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { generateString } from '@/libs/utils/generateString';
import { Prisma } from '@prisma/client';
import { ApiMethod, Register } from '@types';
import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string
  data?: any
}

/**
 * @method POST
 * @description Create new User
 * @param req body: {loginId, password, email}
 * @param res message
 */

const credentialsConfig = {
  type: 'credentials',
  provider: process.env.CREDENTIAL_SECRET,
  providerId: process.env.CREDENTIAL_ID
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === ApiMethod.POST) {
    //Req data
    const { loginId, password, email }: Register = req.body
    if (!loginId || !password || !email) return res.status(404).json({ message: 'Form data not found or field is missing' })

    //Check email
    const checkUser = await prismaClient.user.findUnique({ where: { email }, select: { accounts: { select: { loginId: true } } } })
    if (checkUser?.accounts.some(i => i.loginId === loginId)) return res.status(400).json({ message: 'loginID already taken' })
    if (checkUser) return res.status(400).json({ message: 'Email used, please register others' })


    //Create prismaClient.User -credential type
    const hashPassword = await hash(password, 12)
    const randomString = generateString(5)
    const provider = `mysql-${randomString}`
    const providerAccountId = generateString(10)

    try {
      const newUser = await prismaClient.user.create({
        data: {
          email,
          accounts: {
            create: {
              loginId,
              password: hashPassword,
              type: 'credentials',
              provider,
              providerAccountId
            }
          }
        },
      })

      return res.status(200).json({ message: 'User created', data: newUser.id })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') return res.status(403).send({ message: 'Email or Login ID already used' });
      }
      return res.status(400).send({ message: 'BAD REQUEST' })
    }

  } else {
    res.status(500).json({ message: 'Invalid request method - Only POST is accepted' })
  }
}
