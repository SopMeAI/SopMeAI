import OpenAI from "openai"
require('dotenv').config()

// Makes a request to OpenAI's API
export async function gptquery(prompt: string, oai?: OpenAI) {
    const API_TOKEN = process.env.OPENAI_API_TOKEN
    const MODEL = 'gpt-3.5-turbo'

    if (!API_TOKEN) return "Missing API TOKEN"

    const openai = (oai)? oai : new OpenAI({
        apiKey: API_TOKEN,
    })

    return await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
    }).then((response:any) => {
        console.log(response)
        return response.choices[0].message.content
    })

}