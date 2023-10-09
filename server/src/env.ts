import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  PORT: z.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string().min(16).max(128),
  AWS_SECRET_ACCESS_KEY: z.string(),
})

let _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(
    'Invalid environment variables: ',
    JSON.stringify(_env.error.format(), null, 4),
  )
  process.exit(1)
}

export const env = _env.data
