import questionRouter from './routes/questions'
import express, { type Request, type Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import { getContractData } from './services/contractAnalysisService'
import { generateContractPrompt } from './services/promptService'
import { sendGPTQueryStream } from './services/largeLanguageModel'
import { sseRouter } from './routes/sse'
import { ChatCompletionMessageParam } from 'openai/resources'
import { runAsyncWrapper } from './utils/runAsyncWrapper'

export const messageHistory: ChatCompletionMessageParam[] = []
const upload = multer()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/sse', sseRouter)
app.use('/questions', questionRouter)

let sendUpdates: Response | undefined

app.get('/api/aws/textract', (request: Request, response: Response) => {
  response.setHeader('Content-Type', 'text/event-stream')
  response.setHeader('Cache-Control', 'no-cache')
  response.setHeader('Connection', 'keep-alive')

  sendUpdates = response
  request.on('close', () => {
    sendUpdates = undefined
  })
})

app.post(
  '/api/aws/textract',
  upload.array('images'),
  runAsyncWrapper(async (request: Request, response: Response) => {
    console.log('Uploaded image was', request.files)
    const images: Buffer[] = []
    if (!Array.isArray(request.files) || request.files.length === 0) {
      response.status(400).send('No images were uploaded')
      return
    }
    for (const file of request.files) {
      images.push(file.buffer)
    }
    try {
      let FullResponse = ''
      const data = await getContractData(images)
      const prompt = generateContractPrompt(data)
      const stream = await sendGPTQueryStream(prompt)

      for await (const chunk of stream) {
        FullResponse += chunk.choices[0]?.delta?.content || ''
        if (sendUpdates) {
          sendUpdates.write(
            `data: ${JSON.stringify({ message: chunk.choices[0]?.delta?.content || '' })}\n\n`,
          )
        }
      }
      messageHistory.push({ content: FullResponse, role: 'assistant' })

      response.status(200).send('Processing... Check the stream for updates.')
    } catch (err) {
      console.error('Error was: ', err)
      response.status(500).send('Error extracting contract data')
    }
  }),
)

export default app
