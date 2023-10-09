import {
  TextractClient,
  AnalyzeDocumentCommand,
  type Block,
} from '@aws-sdk/client-textract'
import { env } from '../env'

const config = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
}

const textractClient = new TextractClient(config)

export async function getContractData(imageBytes: Buffer) {
  const blocks = await analyzeDocument(imageBytes)
  const text = getText(blocks)
  const checkboxes = getCheckboxes(blocks)
  return { text, checkboxes }
}

async function analyzeDocument(imageBytes: Buffer) {
  const input = {
    Document: {
      Bytes: imageBytes,
    },
    FeatureTypes: ['FORMS'],
  }
  const analyzeCommand = new AnalyzeDocumentCommand(input)
  try {
    const response = await textractClient.send(analyzeCommand)
    return response.Blocks ?? []
  } catch (error) {
    throw new Error(`Error analyzing document: ${error}`)
  }
}

function getText(blocks: Block[]) {
  return blocks
    .filter((block) => block.BlockType === 'LINE')
    .map((block) => block.Text)
    .join('\n')
}

function getCheckboxes(blocks: Block[]) {
  return blocks
    .filter((block) => block.BlockType === 'SELECTION_ELEMENT')
    .map((block) => {
      const isSelected = block.SelectionStatus === 'SELECTED'
      const label = block.Text ?? ''
      return { isSelected, label }
    })
}
