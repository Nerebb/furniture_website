// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateFilterSchemaValidate, SearchFilterSchemaValidate } from '@/libs/schemaValitdate'
import { Category, Prisma } from '@prisma/client'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
type Data = {
  data?: Category[] | Category
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case ApiMethod.GET:
      try {
        const schema = Yup.object(SearchFilterSchemaValidate)
        const { id, limit, filter, sort, skip } = await schema.validate(req.query)

        //GetOne
        if (typeof id === 'number') {
          const data = await prismaClient.category.findUniqueOrThrow({
            where: { id }
          })
          return res.status(200).json({ data, message: `Get categoryId:${id} success` })
        }


        //GetMany
        let orderBy: Prisma.CategoryOrderByWithRelationInput = {};
        if (filter && sort) orderBy[filter] = sort

        const data = await prismaClient.category.findMany({
          where: { id: { in: id } },
          orderBy,
          // skip: (curPage || 0) * (limit || 10),
          take: limit || 10,
        })

        if (!data) throw new Error("No Category found")

        const totalRecord = await prismaClient.category.count({
          orderBy
        })

        res.setHeader('content-range', JSON.stringify({ totalRecord }))
        return res.status(200).json({ data, message: "Get Category success" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    case ApiMethod.POST:
    case ApiMethod.PUT:
      try {
        const schema = Yup.object(CreateFilterSchemaValidate).typeError("Invalid Object")
        const validateSchema = async () => {
          try {
            const validated = await schema.validate(req.body)
            return validated
          } catch (err) {
            try {
              const validated = await schema.validate(JSON.parse(req.body))
              return validated
            } catch (error) {
              throw error
            }
          }
        }
        const { id, label } = await validateSchema()
        const data = await prismaClient.category.upsert({
          where: { id, label },
          update: { label },
          create: { label },
        })

        return res.status(200).json({ data, message: "Category create/updated" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    case ApiMethod.DELETE:
      try {
        if (req.query.id && typeof req.query.id === 'string') req.query.id = [req.query.id]

        const schema = Yup.object({ id: Yup.array().of(Yup.number().min(1).required()).required() })
        const { id } = await schema.validate(req.query)

        const data = await prismaClient.category.deleteMany(
          { where: { id: { in: id } } }
        )

        if (!data.count) throw new Error("Categories not found")

        return res.status(200).json({ message: "Delete Category success" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    default:
      return res.status(405).json({ message: "Invalid Method" })
  }
}
