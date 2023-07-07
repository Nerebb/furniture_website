// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApiMethod } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup'
import { verifyToken } from '../auth/customLogin';
import prismaClient from '@/libs/prismaClient';

type Data = {
    data?: boolean
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = await verifyToken(req, res)
    if (!token || !token.userId || token.role === 'guest') return res.status(200).json({ data: false, message: "Invalid user" })

    switch (req.method) {
        case ApiMethod.GET:
            try {
                const { productId } = await Yup.object({ productId: Yup.string().uuid().required() }).validate(req.query)
                const order = await prismaClient.order.findFirst({
                    where: {
                        ownerId: token.userId,
                        orderedProducts: {
                            some: { productId }
                        }
                    }
                })
                return res.status(200).json({ data: order ? true : false })
            } catch (error: any) {
                return res.status(400).json({ message: error.message || "CheckOrder: Unknown error" })
            }
        default:
            return res.status(405).json({ message: "Invalid method" })
    }
}
