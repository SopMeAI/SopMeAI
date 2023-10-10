import { cleanEnv, num, str } from 'envalid'
import dotenv from 'dotenv'
dotenv.config()

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  AWS_REGION: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
})

export { env }
