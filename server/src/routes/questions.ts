import express, { Router, Request } from 'express'

import { sendGPTQuery } from '../services/largeLanguageModel'
import { sendUpdates } from './sse'

const questionRouter = Router()

questionRouter.post('/', express.json(), async (req: Request, res) => {
  const { prompt } = req.body as { prompt: string }
  try {
    const completion = await sendGPTQuery(prompt)
    sendUpdates(completion)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default questionRouter
