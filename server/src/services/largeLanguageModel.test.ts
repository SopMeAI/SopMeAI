import * as llm from './largeLanguageModel'



describe('getHelloWorldMessage', () => {
  /*it('returns "Hello World!"', async () => {
    const prompt = 'Anwser this with nothing but "Hello World!"'

    const message = await llm.query({inputs: prompt})

    expect(message[0].generated_text).toEqual('Hello World')
  })*/

  it('send long request', async () => {
    const fs = require('fs')
    const text = fs.readFileSync('./test-data/lease-png-aws/rawText.txt', 'utf-8')
    
    const prompt = `Hello! Could you please summarise information in the following agreement, and notify me if there are parts that are not in my favor. The data was gotten through OCR, so there may be some missing data, so you may need to make some consessions. Here is the text: ${text}`
    const completion = await llm.gptquery(prompt)
    console.log(prompt)
    console.log(completion)
  }, 100_000)
})

