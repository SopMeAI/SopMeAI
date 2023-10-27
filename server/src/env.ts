import dotenv from 'dotenv'
import { cleanEnv, num, str, testOnly } from 'envalid'

dotenv.config()

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  AWS_REGION: str({ devDefault: testOnly('test') }),
  AWS_ACCESS_KEY_ID: str({ devDefault: testOnly('test') }),
  AWS_SECRET_ACCESS_KEY: str({ devDefault: testOnly('test') }),
  OPENAI_API_TOKEN: str({ devDefault: testOnly('test') }),
})

export { env }
