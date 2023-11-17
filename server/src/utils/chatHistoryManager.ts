import fs from 'fs/promises'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import path from 'path'

const dataDirectory = path.join(__dirname, '..', 'data')

export const ensureDataDirectoryExists = async (): Promise<void> => {
  try {
    await fs.access(dataDirectory)
  } catch {
    await fs.mkdir(dataDirectory, { recursive: true })
  }
}

// Function to write history to a file
export const writeHistoryToFile = async (
  sessionId: string,
  history: ChatCompletionMessageParam[],
): Promise<void> => {
  const filePath = path.join(dataDirectory, `${sessionId}.json`)
  try {
    await fs.writeFile(filePath, JSON.stringify(history, null, 2), 'utf8')
  } catch (error) {
    console.error('Failed to write history to file:', error)
  }
}
