// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = any

export async function test() {
  return console.log("testRunning")
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
  res.status(200).json({ ip })
}
