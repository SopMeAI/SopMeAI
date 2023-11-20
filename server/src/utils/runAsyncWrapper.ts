import type { Request, Response, NextFunction } from 'express'

type AsyncCallback = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export function runAsyncWrapper(callback: AsyncCallback) {
  return function (req: Request, res: Response, next: NextFunction) {
    callback(req, res, next).catch(next)
  }
}
