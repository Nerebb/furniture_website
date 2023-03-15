// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prismaClient from '@/libs/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data?: any
  message?: string
}

export async function test() {
  return console.log("testRunning")
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { limit, skip } = req.query
  const data = await prismaClient.product.findMany({
    take: parseInt(limit as string),
    skip: parseInt(skip as string) || undefined,
  })
  res.status(200).json({ data })
}
