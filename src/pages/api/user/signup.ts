import prismaClient from '@/libs/prismaClient';
import { RegisterByAdminSchemaValidate, RegisterSchemaValidate } from '@/libs/schemaValitdate';
import { generateString } from '@/libs/utils/generateString';
import { Prisma } from '@prisma/client';
import { ApiMethod } from '@types';
import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';
import { verifyToken } from '../auth/customLogin';

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
export async function clientRegister(req: NextApiRequest) {

}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case ApiMethod.POST:
      //Req data
      const token = await verifyToken(req)

      const clientSchema = Yup.object(RegisterSchemaValidate)
      const adminRegisterSchema = Yup.object(RegisterByAdminSchemaValidate)

      const validateSchema = async () => {
        try {
          const validated = await clientSchema.validate(req.body)
          return validated
        } catch (error) {
          try {
            const validated = await clientSchema.validate(JSON.parse(req.body))
            return validated
          } catch (error) {
            throw error
          }
        }
      }

      const { loginId, email, password } = await validateSchema()

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
        let createUserData: Prisma.UserCreateInput = {
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
        }

        if (token?.role === 'admin') {
          try {
            const userInfo = await adminRegisterSchema.validate(JSON.parse(req.body))
            createUserData = {
              ...createUserData,
              ...userInfo,
              userVerified: userInfo.userVerified ? new Date() : null,
              emailVerified: userInfo.emailVerified ? new Date() : null,
              deleted: userInfo.deleted ? new Date() : null,
            }
          } catch (error: any) {
            return res.status(400).json({ message: error.message || "CreateUserAsAdmin - FieldValidation error" })
          }
        }

        const newUser = await prismaClient.user.create({
          data: createUserData,
        })

        return res.status(200).json({ message: 'User created', data: newUser.id })
      } catch (error: any) {
        console.log("🚀 ~ file: signup.ts:100 ~ error:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') return res.status(400).send({ message: 'Email Login ID already used' });
        }
        return res.status(400).send({ message: error.message || "Unknown error" })
      }

    default:
      return res.status(405).json({ message: "Invalid method" })
  }
}
