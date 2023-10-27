import fs from 'fs'
import MockOpenAI from '../__mocks__/MockOpenAI'
import { sendGPTQuery } from './largeLanguageModel'

describe('llm functional test', () => {
  it('sends test request to GPT', async () => {
    const text = fs.readFileSync('./test-data/sample/rawText.txt', 'utf-8')
    const prompt = `Hello! Could you please summarise information in the following agreement, and notify me if there are parts that are not in my favor. The data was gotten through OCR, so there may be some missing data, so you may need to make some consessions. Here is the text: ${text}`
    const completion = await sendGPTQuery(prompt, MockOpenAI)

    console.log(`Returned completion: ${completion}`)
  }, 100_000)
})
