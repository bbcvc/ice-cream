// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSummarg, getSummargByAi } from '@/lib/getSummary'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { hashKey, slug, content } = req.body

  if (content === '') {
    res.status(500)
    return
  }

  const post = {
    slug: hashKey,
    content
  }

  const data = await getSummargByAi(post)

  res.status(200).json({ data: data!})
}
