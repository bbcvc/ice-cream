import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

export default async function handler(req: Request, res: Response) {
  let { prompt: content,
    systemPrompt,
    model = 'gpt-3.5-turbo',
    temperature = '0.7',
    p = ''
  } = await req.json();

  const apiKey = req.headers.get('api-key');
  if (!apiKey) {
    return new Response('No API key provided', { status: 405 });
  }

  const config = new Configuration({
    apiKey
  })
  const openai = new OpenAIApi(config)

  const response = await openai.createChatCompletion({
    model,
    stream: true,
    messages: [
      {
        role: "system",
        content: systemPrompt || ''
        //   "You are an AI writing assistant that continues existing text based on context from prior text. " +
        //   "Give more weight/priority to the later characters than the beginning ones. " +
        //   "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
        // // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        // // "Use Markdown formatting when appropriate.",
      },
      { role: 'user', content },
    ],
    temperature: Number(temperature),
    top_p: Number(p),
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  })
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
