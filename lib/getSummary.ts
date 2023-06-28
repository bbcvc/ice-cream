import { OpenAI, PromptTemplate } from "langchain";
import { AnalyzeDocumentChain, loadSummarizationChain } from "langchain/chains"
import removeMarkdown from "remove-markdown"
import Redis from "ioredis"
import { createClient } from '@supabase/supabase-js'

interface post {
  slug: string
  summarg: string
}

interface OriginPost {
  slug: string
  content: string
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const redisUrl = process.env.REDIS_URL
const openaiKey = process.env.OPENAI_API_KEY

let db: any
let redisClient: Redis
let model: OpenAI

if (supabaseUrl && supabaseKey) {
  db = createClient(supabaseUrl, supabaseKey)
}

if (redisUrl) {
  redisClient = new Redis(redisUrl)
}

if (openaiKey) {
  model = new OpenAI({
    openAIApiKey: openaiKey,
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    maxTokens: 400,
  })
}

async function cacheData(slug: string, dbQuery: () => Promise<string | null>): Promise<string | null> {
  // 尝试从缓存中获取数据
  const cachedResult = await redisClient.get(slug);
  if (cachedResult !== null) {
    console.log(`Cache hit for key "${slug}"`);
    return cachedResult;
  }

  // 如果缓存中没有数据，则从数据库中查询数据
  console.log(`Cache miss for key "${slug}"`);
  const dbResult = await dbQuery();
  dbResult && console.log(`db hit for key "${slug}"`);

  // 将查询结果写入缓存
  dbResult && redisClient.set(slug, dbResult, 'EX', 60 * 60 * 24); // 设置缓存有效期为 1 天

  return dbResult;
}

async function dbSummarg(slug: string): Promise<string | null> {
  let { data, error } = await db
    .from('summarg')
    .select('*')
    .eq('slug', slug)
    .single()

  return error ? null : (data as post).summarg
}

export async function getSummargByAi(post: OriginPost, lang = 'zh') {
  const { slug, content } = post

  let res = await cacheData(slug, () => dbSummarg(slug))

  if (res) {
    return res
  }

  const prompt = new PromptTemplate({
    template: `Summarize this in "${lang}" language:
        "{text}"
        CONCISE SUMMARY:`,
    inputVariables: ["text"],
  })

  const combineDocsChain = loadSummarizationChain(model, {
    type: "map_reduce",
    combineMapPrompt: prompt,
    combinePrompt: prompt,
  })

  const chain = new AnalyzeDocumentChain({
    combineDocumentsChain: combineDocsChain,
  })

  const data = await chain.call({
    input_document: removeMarkdown(content, {
      useImgAltText: true,
      gfm: true,
    }),
  })

  if (!res) {
    const { error } = await db?.from('summarg').insert(
      {
        slug,
        summarg: data.text
      })
  }

  res = data.text || '错误'

  return res
}

export async function getSummarg(post: Record<string, string>, lang = 'zh') {
  const id = Object.keys(post)[0]
  const content = Object.values(post)[0]

  let res = await redisClient.get(id)
  if (res) {
    return res
  }

  const prompt = new PromptTemplate({
    template: `Summarize this in "${lang}" language:
        "{text}"
        CONCISE SUMMARY:`,
    inputVariables: ["text"],
  })

  const combineDocsChain = loadSummarizationChain(model, {
    type: "map_reduce",
    combineMapPrompt: prompt,
    combinePrompt: prompt,
  })

  const chain = new AnalyzeDocumentChain({
    combineDocumentsChain: combineDocsChain,
  })

  const data = await chain.call({
    input_document: removeMarkdown(content, {
      useImgAltText: true,
      gfm: true,
    }),
  })

  res = data.text || '错误'

  return res
}
