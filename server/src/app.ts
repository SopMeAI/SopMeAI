import express from 'express'
import { helloWorldController } from './controllers/helloWorld'

const app = express()

app.get('/', helloWorldController)

export default app
