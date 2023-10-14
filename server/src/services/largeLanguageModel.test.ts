import * as llm from './largeLanguageModel'



describe('getHelloWorldMessage', () => {
  it('returns "Hello World!"', async () => {
    const prompt = 'Anwser this with nothing but "Hello World!"'

    const message = await llm.query({inputs: prompt})

    expect(message[0].generated_text).toEqual('Hello World!')
  })

  it('send long request', async () => {
    const fs = require('fs')
    const text = fs.readFile('../../test-data/lease-png-aws/rawText.txt', 'utf-8', (err:string,data:string) => {
      if (err) throw err
      return data
    })
    
    const prompt = `Summarise information in the following agreement. The data was gotten through OCR, so there may be some missing data, so you may need to make some consessions. Here is the text: ${text}`
    const completion = await llm.query({inputs:prompt})

    expect(completion[0].generated_text).toEqual('')
  })
})

