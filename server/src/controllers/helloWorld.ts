import { Request, Response } from 'express'
import { getHelloWorldMessage } from '../services/helloWorld'

export function helloWorldController(_req: Request, res: Response) {
  const message = getHelloWorldMessage()
  res.send(message)
}
