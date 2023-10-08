import * as llm from './largeLanguageModel'

describe('getHelloWorldMessage', () => {
  it('returns "Hello World!"', async () => {
    const prompt = 'Anwser this with nothing but "Hello World!"'

    const message = await llm.query({input: prompt})

    expect(message).toEqual('Hello World!')
  })
})
