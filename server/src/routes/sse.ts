import { Request, Response, Router } from 'express'
import { addClient, sendUpdates, removeClient } from '../utils/sseClients'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const clientId = addClient(res)

  res.write(`data: ${JSON.stringify({ message: 'Connection established' })}\n\n`)

  req.on('close', () => {
    removeClient(clientId)
  })
})

export { router as sseRouter, sendUpdates }
