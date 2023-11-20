import dotenv from 'dotenv'
import { cleanEnv, num, str, testOnly } from 'envalid'

dotenv.config()

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  AWS_REGION: str({ default: 'us-east-1', devDefault: testOnly('us-east-1') }),
  AWS_ACCESS_KEY_ID: str({ default: '', devDefault: testOnly('us-west-2') }),
  AWS_SECRET_ACCESS_KEY: str({ default: '', devDefault: testOnly('us-west-2') }),
  OPENAI_API_TOKEN: str({ default: '', devDefault: testOnly('test') }),
})

export { env }
