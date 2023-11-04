import { getHelloWorldMessage } from './helloWorld'

describe('getHelloWorldMessage', () => {
  it('returns "Hello World!"', () => {
    const message = getHelloWorldMessage()
    expect(message).toBe('Hello World!')
  })
})
