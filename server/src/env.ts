import { cleanEnv, num, str, testOnly } from 'envalid'
import dotenv from 'dotenv'
dotenv.config()

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  AWS_REGION: str({ devDefault: testOnly('') }),
  AWS_ACCESS_KEY_ID: str({ devDefault: testOnly('') }),
  AWS_SECRET_ACCESS_KEY: str({ devDefault: testOnly('') }),
  OPENAI_API_TOKEN: str({ devDefault: testOnly('') })
})

export { env }
