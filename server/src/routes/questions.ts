import { Router, Request } from 'express'
import { runAsyncWrapper } from '../utils/runAsyncWrapper'
import { sendGPTQueryWithHistory } from '../services/largeLanguageModel'
import { sendUpdates } from './sse'
import { messageHistory } from '../app'
import { writeHistoryToFile } from '../utils/chatHistoryManager'
const questionRouter = Router()

questionRouter.post(
  '/',
  runAsyncWrapper(async (req: Request, res) => {
    const { prompt } = req.body as { prompt: string }
    try {
      const completion = await sendGPTQueryWithHistory(prompt, messageHistory)
      let FullResponse = ''
      for await (const chunk of completion) {
        FullResponse += chunk.choices[0]?.delta?.content || ''

        sendUpdates(chunk.choices[0]?.delta?.content || '')
      }

      if (FullResponse !== '') {
        messageHistory.push({ content: FullResponse, role: 'assistant' })
      }

      await writeHistoryToFile('1', messageHistory)
      res.status(204).end()
    } catch (error) {
      //res.status(500).json({ error: error.message })
    }
  }),
)

export default questionRouter
