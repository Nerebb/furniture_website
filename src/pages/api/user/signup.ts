// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient';
import { SeverRegisterSchemaValidate } from '@/libs/schemaValitdate';
import { generateString } from '@/libs/utils/generateString';
import { Prisma } from '@prisma/client';
import { ApiMethod } from '@types';
import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

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
  switch (req.method) {
    case ApiMethod.POST:
      //Req data
      const schema = Yup.object(SeverRegisterSchemaValidate)

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

      const { loginId, email, password, name, nickName, address, gender, phoneNumber, birthDay, role } = await validateSchema()

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
            email, name, nickName, address, gender, phoneNumber, birthDay, role,
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
      } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') return res.status(400).send({ message: 'Email Login ID already used' });
        }
        return res.status(400).send({ message: error.message || "Unknown error" })
      }

    default:
      return res.status(405).json({ message: "Invalid method" })
  }
}
