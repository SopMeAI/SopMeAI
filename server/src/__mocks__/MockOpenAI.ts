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

const MockOpenAI:OpenAI = new OpenAI({ apiKey: 'mock apiKey' })
MockOpenAI.chat.completions.create = <any> create

export default MockOpenAI