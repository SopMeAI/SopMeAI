import OpenAI from "openai"
import { env } from '../env'

// Connection Requirements
const API_TOKEN = env.OPENAI_API_TOKEN
const MODEL = 'gpt-3.5-turbo'

// Initialises the default client
const defaultClient =  new OpenAI({
        apiKey: API_TOKEN,
    })

// Makes a request to OpenAI's API
export async function sendGPTQuery(prompt: string, client: OpenAI = defaultClient) {

    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
    }).then((response:any) => {
        return response
    })

    const completion = response.choices[0].message.content

    return completion
}