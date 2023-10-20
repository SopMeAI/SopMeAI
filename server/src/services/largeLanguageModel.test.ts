import * as llm from './largeLanguageModel'
import MockOpenAI from '../__mocks__/MockOpenAI'


describe('llm functional test', () => {

  it('sends test request to GPT', async () => {
    const fs = require('fs')
    const text = fs.readFileSync('./test-data/lease/rawText.txt', 'utf-8')

    
    const prompt = `Hello! Could you please summarise information in the following agreement, and notify me if there are parts that are not in my favor. The data was gotten through OCR, so there may be some missing data, so you may need to make some consessions. Here is the text: ${text}`
    const completion = await llm.gptquery(prompt, MockOpenAI)
    console.log(completion)
  }, 100_000)
})

