import questionRouter from './routes/questions'
import express, { type Request } from 'express'
import cors from 'cors'
import multer from 'multer'
import { getContractData } from './services/contractAnalysisService'
import { generateContractPrompt } from './services/promptService'
import { sendGPTQuery } from './services/largeLanguageModel'
import { sendUpdates, sseRouter } from './routes/sse'
import { ChatCompletionMessageParam } from 'openai/resources'
import { runAsyncWrapper } from './utils/runAsyncWrapper'

export const messageHistory: ChatCompletionMessageParam[] = []
const upload = multer()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/sse', sseRouter)
app.use('/questions', questionRouter)

app.post(
  '/api/aws/textract',
  upload.array('images'),
  runAsyncWrapper(async (request: Request, response) => {
    /* upload.array('images') -> 'images' name is derived from the formData key/value pair, 
     e.g formData.append('images', image).
     Image(s) and other related data is found in the request.file header
     e.g 
     console.log('Uploaded image was', (request as any).files)
  */
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
      const stream = await sendGPTQuery(prompt)

      for await (const chunk of stream) {
        FullResponse += chunk.choices[0]?.delta?.content || ''
        sendUpdates(chunk.choices[0]?.delta?.content || '')
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
