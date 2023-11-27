import OpenAI from 'openai'
import { Stream } from 'openai/streaming'
import { ChatCompletion, ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources'
import { env } from '../env'
// Connection Requirements
const API_TOKEN = env.OPENAI_API_TOKEN
const MODEL = 'gpt-3.5-turbo'

// Initialises the default client
const defaultClient = new OpenAI({
  apiKey: API_TOKEN,
})
// Makes a request to OpenAI's API
export async function sendGPTQuery(
  prompt: string,
  client: OpenAI = defaultClient,
): Promise<ChatCompletion> {
  const response: ChatCompletion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
  })
  return response
}

export async function sendGPTQueryWithHistory(
  prompt: string,
  messageHistory: ChatCompletionMessageParam[] = [],
  client: OpenAI = defaultClient,
): Promise<Stream<ChatCompletionChunk>> {
  messageHistory.push({ content: prompt, role: 'user' })
  const response: Stream<ChatCompletionChunk> = await client.chat.completions.create({
    model: MODEL,
    messages: messageHistory,
    stream: true,
  })
  return response
}
