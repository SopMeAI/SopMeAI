import { Router, Request } from 'express'
import { runAsyncWrapper } from '../utils/runAsyncWrapper'
import { sendGPTQuery } from '../services/largeLanguageModel'
import { sendUpdates } from './sse'

const questionRouter = Router()

questionRouter.post(
  '/',
  runAsyncWrapper(async (req: Request, res) => {
    console.log('req', req.body)
    const { prompt } = req.body as { prompt: string }
    console.log('Promt:', prompt)
    try {
      const completion = await sendGPTQuery(prompt)
      for await (const chunk of completion) {
        // response.write(chunk.choices[0]?.delta?.content || '')
        sendUpdates(chunk.choices[0]?.delta?.content || '')
      }
      res.status(204).end()
    } catch (error) {
      //res.status(500).json({ error: error.message })
    }
  }),
)

export default questionRouter
