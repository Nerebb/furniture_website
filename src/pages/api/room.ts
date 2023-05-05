// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { CreateFilterSchemaValidate, DeleteFilterSchemaValidate, SearchFilterSchemaValidate, UpdateFilterSchemaValidate } from '@/libs/schemaValitdate'
import { Prisma, Room } from '@prisma/client'
import { ApiMethod, FilterSearch } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'

type Data = {
    data?: Room | Room[]
    message: string
}

/**
 * @method GET
 * @description Get one room by Id
 * @param roomId req.query
 * @returns Room
 */
export async function getRoom(roomId: number) {
    const data = await prismaClient.room.findUniqueOrThrow({
        where: { id: roomId }
    })
    return data
}

/**
 * @method GET
 * @description Get rooms by filter/search
 * @param searchParams req.query
 * @returns Room[]
 */
export async function getRooms(searchParams: Partial<FilterSearch>) {
    let orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    if (searchParams.filter && searchParams.sort) orderBy[searchParams.filter] = searchParams.sort

    const data = await prismaClient.room.findMany({
        where: { id: { in: searchParams.id } },
        orderBy,
        skip: searchParams.skip,
        take: searchParams.limit || 10,
    })

    const totalRecord = await prismaClient.room.count({
        orderBy
    })

    return { data, totalRecord }
}

/**
 * @method PUT
 * @description update one Room by Id 
 * @param room {id:number,label:string} - req.body
 * @returns Room
 * @access Admin
 */
export async function updateRoomById(room: Required<Room>) {
    const data = await prismaClient.room.update({
        where: { id: room.id },
        data: { label: room.label }
    })

    return data
}

/**
 * @method POST
 * @description create category
 * @param room {id:number,label:string} - req.body
 * @returns Room
 * @access Admin
 */
export async function createRoom(room: { id?: number, label: string }) {
    const data = await prismaClient.room.create({
        data: room
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
export async function deleteRooms(roomIds: number | number[]) {
    const data = await prismaClient.room.deleteMany(
        { where: { id: { in: roomIds } } }
    )
    return data
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const schema = Yup.object(SearchFilterSchemaValidate)
                const validated = await schema.validate(req.query)

                //GetOne
                if (typeof validated.id === 'number') {
                    const data = await getRoom(validated.id)
                    return res.status(200).json({ data, message: `Get roomId:${validated.id} success` })
                }


                //GetMany
                const { data, totalRecord } = await getRooms(validated)

                if (!data) throw new Error("No color found")

                res.setHeader('content-range', JSON.stringify({ totalRecord }))
                return res.status(200).json({ data, message: "Get color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.PUT:
            try {
                const schema = Yup.object(UpdateFilterSchemaValidate).typeError("Invalid Object")
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
                const validated = await validateSchema()

                const data = await updateRoomById(validated)
                return res.status(200).json({ data, message: "Room updated" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.POST:
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
                const validated = await validateSchema()
                const data = await createRoom(validated)
                return res.status(200).json({ data, message: "Room created" })
            } catch (error: any) {
                if (error.code === 'P2002' && error.meta.target == 'PRIMARY') return res.status(400).json({ message: "ID already signed" })
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        case ApiMethod.DELETE:
            try {
                const schema = Yup.object(DeleteFilterSchemaValidate)
                const { id } = await schema.validate(req.query)

                const data = await deleteRooms(id)

                if (!data.count) throw new Error("Colors not found")

                return res.status(200).json({ message: "Delete color success" })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "Unknow error" })
            }
        default:
            return res.status(405).json({ message: "Invalid Method" })
    }
}
