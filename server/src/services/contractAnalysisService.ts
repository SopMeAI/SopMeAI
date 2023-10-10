import { TextractClient, AnalyzeDocumentCommand, type Block } from '@aws-sdk/client-textract'
import { env } from '../env'

type ContractData = {
  text: string
  checkboxes: Checkbox[]
}

type Checkbox = {
  isSelected: boolean
  label: string
}

const config = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
}

const textractClient = new TextractClient(config)

export async function getContractData(
  imageBytes: Buffer,
  client: TextractClient = textractClient,
): Promise<ContractData> {
  const blocks = await analyzeDocument(imageBytes, client)
  const text = getText(blocks)
  const checkboxes = getCheckboxes(blocks)
  return { text, checkboxes }
}

export async function analyzeDocument(
  imageBytes: Buffer,
  client: TextractClient = textractClient,
): Promise<Block[]> {
  const input = {
    Document: {
      Bytes: imageBytes,
    },
    FeatureTypes: ['FORMS'],
  }
  const analyzeCommand = new AnalyzeDocumentCommand(input)
  try {
    const response = await client.send(analyzeCommand)
    return response.Blocks ?? []
  } catch (error) {
    throw new Error(`Error analyzing document: ${error}`)
  }
}

export function getText(blocks: Block[]): string {
  return blocks
    .filter((block) => block.BlockType === 'LINE')
    .map((block) => block.Text)
    .join('\n')
}

export function getCheckboxes(blocks: Block[]): Checkbox[] {
  const keyValueSets = blocks.filter((block) => block.BlockType === 'KEY_VALUE_SET')
  for (const block of keyValueSets) {
    console.log(block)
    if (block.Relationships) {
      for (const relationship of block.Relationships) {
        console.log(relationship)
      }
    }
    console.log('---\n')
  }
  return blocks
    .filter((block) => block.BlockType === 'SELECTION_ELEMENT')
    .map((block) => {
      const isSelected = block.SelectionStatus === 'SELECTED'
      const label = block.Text ?? ''
      return { isSelected, label }
    })
}

export function contractDataToString(contractData: ContractData): string {
  const { text, checkboxes } = contractData
  const textData = `Text:\n${text}\n\nCheckboxes:\n${JSON.stringify(checkboxes, null, 2)}`
  return textData
}
