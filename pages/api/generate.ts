import { OpenAIStream, streamToResponse } from 'ai'
import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const aiResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [{ role: 'user', content: 'What is love?' }]
  })

  const stream = OpenAIStream(aiResponse)

  /**
   * Converts the stream to a Node.js Response-like object
   */
  return streamToResponse(stream, res)
}
