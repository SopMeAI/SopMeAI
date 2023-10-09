import express from 'express'
import { helloWorldController } from './controllers/helloWorld'
import * as llm from './services/largeLanguageModel'

const app = express()

app.get('/', helloWorldController)
const prompt = 'Anwser this with nothing but "Hello World!"'

async function async() {
    await llm.query({"inputs": "The answer to the universe is"}).then((response) => {
        console.log(response[0].generated_text);
    })
    console.log(prompt)
}
async()

export default app
