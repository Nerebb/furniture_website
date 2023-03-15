// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { Category, Prisma } from '@prisma/client'
import { ApiMethod } from '@types'
import * as Yup from 'yup'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data?: Omit<Category, ''>[]
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case ApiMethod.GET:
      try {
        const data = await prismaClient.category.findMany()
        return res.status(200).json({ data, message: "Get category success" })
      } catch (error: any) {
        return res.status(401).json({ message: error.message || "Unknow error" })
      }

    default:
      return res.status(500).json({ message: "Invalid Method" })
  }
}
