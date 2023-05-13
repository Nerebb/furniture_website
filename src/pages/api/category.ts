// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateFilterSchemaValidate, DeleteFilterSchemaValidate, SearchFilterSchemaValidate, UpdateFilterSchemaValidate } from '@/libs/schemaValitdate'
import { Category, Prisma } from '@prisma/client'
import { ApiMethod, FilterSearch } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from './auth/customLogin'
import { JWT } from 'next-auth/jwt'
type Data = {
  data?: Category[] | Category
  message: string
}

/**
 * @method GET /api/category?id=<string>&filter=<"id"||"label">&sort=<"asc"||"desc">&limit=<number>&skip=<number>
 * @description Get categories by filter/search
 * @access everyone
 * @returns Category | Category[]
 */
export async function getCategories(searchParams: Partial<FilterSearch>) {
  let orderBy: Prisma.CategoryOrderByWithRelationInput = {};
  if (searchParams.filter && searchParams.sort) orderBy[searchParams.filter] = searchParams.sort

  const data = await prismaClient.category.findMany({
    where: {
      id: { in: searchParams.id },
      label: { contains: searchParams.label }
    },
    orderBy,
    skip: searchParams.skip,
    take: searchParams.limit || 10,
  })

  const totalRecord = await prismaClient.category.count({
    orderBy
  })

  return { data, totalRecord }
}

export async function getCategory(cateId: number) {
  const data = await prismaClient.category.findUniqueOrThrow({
    where: { id: cateId }
  })
  return data
}

/**
 * @method PUT /api/category
 * @description update one category by Id
 * @body {id:number,label:string}
 * @access Admin
 * @return Category
 */
export async function updateCateById(cate: Required<Category>) {
  const data = await prismaClient.category.update({
    where: { id: cate.id },
    data: { label: cate.label }
  })

  return data
}

/**
 * @method POST
 * @description create category
 * @param cate {id:number,label:string} - req.body
 * @returns Category
 * @access Admin
 */
export async function createCategory(cate: { id?: number, label: string }) {
  const data = await prismaClient.category.create({
    data: cate
  })

  return data
}

/**
 * @method DELETE
 * @description pernament delete category
 * @param cateIds Array id of category
 * @returns message
 * @access Admin
 */
export async function deleteCategories(cateIds: number | number[]) {
  const data = await prismaClient.category.deleteMany(
    { where: { id: { in: cateIds } } }
  )
  return data
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = await verifyToken(req)
  if (!token || !token.userId) return res.status(401).json({ message: "Invalid user" })

  switch (req.method) {
    case ApiMethod.GET:
      try {
        const schema = Yup.object(SearchFilterSchemaValidate)
        const validated = await schema.validate(req.query)

        //GetOne
        if (typeof validated.id === 'number') {
          const data = await getCategory(validated.id)
          return res.status(200).json({ data, message: `Get categoryId:${validated.id} success` })
        }

        //GetMany
        const { data, totalRecord } = await getCategories(validated)

        if (!data) throw new Error("No Category found")
        res.setHeader('content-range', JSON.stringify({ totalRecord }))
        return res.status(200).json({ data, message: "Get Category success" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    case ApiMethod.PUT:
      if (token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })
      try {
        const schema = Yup.object(UpdateFilterSchemaValidate).typeError("Invalid Object")
        const requestData = typeof req.body === "string" ? JSON.parse(req.body) : req.body

        const validated = await schema.validate(requestData)
        const data = await updateCateById(validated)

        return res.status(200).json({ data, message: "Category updated" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    case ApiMethod.POST:
      if (token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })

      try {
        const schema = Yup.object(CreateFilterSchemaValidate).typeError("Invalid Object")
        const requestData = typeof req.body === "string" ? JSON.parse(req.body) : req.body

        const validated = await schema.validate(requestData)
        const data = await createCategory(validated)

        return res.status(200).json({ data, message: "Category created" })
      } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target == 'PRIMARY') return res.status(400).json({ message: "ID already signed" })
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    case ApiMethod.DELETE:
      if (token.role !== 'admin') return res.status(401).json({ message: "Unauthorize user" })

      try {
        const schema = Yup.object(DeleteFilterSchemaValidate)
        const { id } = await schema.validate(req.query)
        const data = await deleteCategories(id)

        if (!data.count) throw new Error("Categories not found")

        return res.status(200).json({ message: "Delete Category success" })
      } catch (error: any) {
        return res.status(400).json({ message: error.message || "Unknow error" })
      }
    default:
      return res.status(405).json({ message: "Invalid Method" })
  }
}
