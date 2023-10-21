import OpenAI from 'openai'

function create(body:OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming | OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming)
{
  console.log(`Openai create called with ${JSON.stringify(body)}`)
  const mockResponse:OpenAI.Chat.ChatCompletion = {
    id: '0',
    choices: [{ finish_reason:'stop', index: 0, message: {content: 'This is a mocked message.', role: 'system'}}],
    created: 0,
    model: 'Mock',
    object: ''
  }
  const promise = (resolve:any) => {
    resolve(mockResponse)
  }

  return new Promise<any>(promise)
}

// Please note that only the create function is actually mocked. Calling other functions still retain original functionality.
// However, it is not possible to make paid API calls with this, as the API-key is not real.
// Regardless, please avoid using functions that do not have a mocked version.

const MockOpenAI:OpenAI = new OpenAI({ apiKey: 'mock apiKey' })
MockOpenAI.chat.completions.create = <any> create

export default MockOpenAI