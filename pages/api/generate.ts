import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextApiRequest, NextApiResponse } from "next";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    if (
      process.env.NODE_ENV != "development" &&
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      const ip = req.headers["x-forwarded-for"];
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(50, "1 d"),
        analytics: true
      });

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `ice_cream_${ip}`,
      );

      if (!success) {
        return new Response("You have reached your request limit for the day.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    let content = 'my name is eric'
    // let { prompt: content } = JSON.parse(req.body);

    // remove trailing slash,
    // slice the content from the end to prioritize later characters
    content = content.replace(/\/$/, "").slice(-5000);
    console.log('content456', content);

    let data
    try {
      data = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI writing assistant that continues existing text based on context from prior text. " +
              "Give more weight/priority to the later characters than the beginning ones. " +
              "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
            // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
            // "Use Markdown formatting when appropriate.",
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
        n: 1,
      })
      return res.status(200).json(data)
    } catch (error) {
      return res.status(429).json(error)
    }
  }
  return res.status(405).json({ message: 'method error' })
  // return res.status(200).json({ a: 666 })

  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);

  // Respond with the stream
  // return res.status(200).json(new StreamingTextResponse(stream))
}
