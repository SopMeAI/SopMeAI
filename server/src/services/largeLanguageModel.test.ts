import * as llm from './largeLanguageModel'

describe('getHelloWorldMessage', () => {
  it('returns "Hello World!"', async () => {
    const prompt = 'Anwser this with nothing but "Hello World!"'

    const message = await llm.query({inputs: prompt})

    expect(message[0].generated_text).toEqual('Hello World!')
  })
})
