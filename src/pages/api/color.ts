// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateColorSchemaValidate, DeleteColorsSchemaValidate, ProductSearchSchemaValidate, SearchColorSchemaValidate, SearchFilterSchemaValidate } from '@/libs/schemaValitdate'
import { Prisma } from '@prisma/client'
import { ApiMethod, ColorSearch, FilterSearch } from '@types'
import { GetColorName } from 'hex-color-to-color-name'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT } from 'next-auth/jwt'
import * as Yup from 'yup'
import { SignedUserData, verifyToken } from './auth/customLogin'

type Color = {
    id: string,
    label?: string,
}

type Data = {
    data?: Color[] | Color
    message: string
}

/**
 * @method GET
 * @description Get colors by filter/search
 * @param colorIds req.query
 * @param searchParams req.query
 * @returns Color | Color[]
 */
export async function getColors(searchParams: Partial<ColorSearch>) {
    let orderBy: Prisma.ColorOrderByWithRelationInput = {};
    if (searchParams.filter && searchParams.sort) orderBy[searchParams.filter] = searchParams.sort

    const data = await prismaClient.color.findMany({
        where: { hex: { in: searchParams.id } },
        orderBy,
        skip: searchParams.skip,
        take: searchParams.limit || 10,
    })

    if (!data) throw new Error("No color found")

    const totalRecord = await prismaClient.color.count({
        orderBy
    })

    return { data, totalRecord }
}

export async function getColor(colorId: string) {
    const data = await prismaClient.color.findUniqueOrThrow({
        where: { hex: colorId }
    })
    return data
}

/**
 * @method PUT
 * @description update one color by id
 * @param color {hex:id,label:string} - req.body
 * @access Admin
 * @returns Color
 */
export async function upsertColor(color: Color) {
    const data = await prismaClient.color.upsert({
        where: { hex: color.id },
        update: { label: color.label ?? GetColorName(color.id) },
        create: { hex: color.id, label: color.label ?? GetColorName(color.id) },
    })
    return data
}

/**
 * @method DELETE
 * @description pernament delete colors
 * @param colorIds Array id of color
 * @access Admin
 * @returns Color
 */
export async function deleteColors(colorIds: string | string[]) {
    const data = await prismaClient.color.deleteMany(
        { where: { hex: { in: colorIds } } }
    )
    return data
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let token: JWT | SignedUserData | null;

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchColorSchemaValidate)
                const validated = await schema.validate(req.query)

                //GetOne
                if (typeof validated.id === 'string') {
                    const data = await getColor(validated.id)
                    return res.status(200).json({ data: { id: data.hex, label: data.label }, message: `Get color:${validated.id} success` })
                }


                //GetMany
                const { data, totalRecord } = await getColors(validated)

                const response = data.map(i => ({ id: i.hex, label: i.label }))
                res.setHeader('content-range', JSON.stringify({ totalRecord }))
                return res.status(200).json({ data: response, message: "Get color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.POST:
        case ApiMethod.PUT:
            try {
                token = await verifyToken(req)
                if (!token || !token.userId) throw new Error("Unauthorize user")
            } catch (error: any) {
                return res.status(405).json({ message: error.message || error })
            }

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
                const validated = await validateSchema()

                const data = await upsertColor(validated)

                return res.status(200).json({ data: { id: data.hex, label: data.label }, message: "Color create/updated" })
            } catch (error: any) {

                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.DELETE:

            try {
                token = await verifyToken(req)
                if (!token || !token.userId) throw new Error("Unauthorize user")
            } catch (error: any) {
                return res.status(405).json({ message: error.message || error })
            }

            try {
                const schema = Yup.object(DeleteColorsSchemaValidate)
                const { id } = await schema.validate(req.query)
                const data = await deleteColors(id)
                if (!data.count) throw new Error("Colors not found")

                return res.status(200).json({ message: "Delete color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
