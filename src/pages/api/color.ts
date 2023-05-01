// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateColorSchemaValidate, ProductSearchSchemaValidate, SearchColorSchemaValidate, SearchFilterSchemaValidate } from '@/libs/schemaValitdate'
import { Prisma } from '@prisma/client'
import { ApiMethod } from '@types'
import { GetColorName } from 'hex-color-to-color-name'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'

type Color = {
    id: string,
    label?: string,
}

type Data = {
    data?: Color[] | Color
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchColorSchemaValidate)
                const { id, limit, filter, sort, skip } = await schema.validate(req.query)

                //GetOne
                if (typeof id === 'string') {
                    const data = await prismaClient.color.findUniqueOrThrow({
                        where: { hex: id }
                    })
                    return res.status(200).json({ data: { id: data.hex, label: data.label }, message: `Get color:${id} success` })
                }


                //GetMany
                let orderBy: Prisma.ColorOrderByWithRelationInput = {};
                if (filter && sort) orderBy[filter] = sort

                const data = await prismaClient.color.findMany({
                    where: { hex: { in: id } },
                    orderBy,
                    // skip: (curPage || 0) * (limit || 10),
                    take: limit || 10,
                })

                if (!data) throw new Error("No color found")

                const totalRecord = await prismaClient.color.count({
                    orderBy
                })

                const response = data.map(i => ({ id: i.hex, label: i.label }))
                res.setHeader('content-range', JSON.stringify({ totalRecord }))
                return res.status(200).json({ data: response, message: "Get color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.POST:
        case ApiMethod.PUT:
            try {
                const schema = Yup.object(CreateColorSchemaValidate).typeError("Invalid Object")
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
                const { id: id, label } = await validateSchema()
                const data = await prismaClient.color.upsert({
                    where: { hex: id },
                    update: { label: label ?? GetColorName(id) },
                    create: { hex: id, label: label ?? GetColorName(id) },
                })

                return res.status(200).json({ data: { id: data.hex, label: data.label }, message: "Color create/updated" })
            } catch (error: any) {

                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.DELETE:
            try {
                if (req.query.id && typeof req.query.id === 'string') req.query.ids = [req.query.id]

                const schema = Yup.object({ ids: ProductSearchSchemaValidate.colorHex.required() })
                const { ids } = await schema.validate(req.query)

                const data = await prismaClient.color.deleteMany(
                    { where: { hex: { in: ids } } }
                )

                if (!data.count) throw new Error("Colors not found")

                return res.status(200).json({ message: "Delete color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
