// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import { ApiMethod } from '@types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    data?: { id: string, name: string }[]
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case ApiMethod.GET:
            try {
                const data = await prismaClient.color.findMany()
                    .then((res) => res.map(i => { return { id: i.hex, name: i.name } }))
                return res.status(200).json({ data, message: "Get color success" })
            } catch (error: any) {
                return res.status(401).json({ message: error.message || "Unknow error" })
            }

        default:
            return res.status(200).json({ message: "BAD REQUEST" })
    }
}
