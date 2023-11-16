import {
  TextractClient,
  AnalyzeDocumentCommand,
  FeatureType,
  type AnalyzeDocumentCommandOutput,
} from '@aws-sdk/client-textract'
import {
  type ApiAnalyzeDocumentResponse,
  TextractDocument,
  SelectionElement,
} from 'amazon-textract-response-parser'

import joinImages from 'join-images'
import {
  ApiBlockType,
  ApiSelectionStatus,
} from 'amazon-textract-response-parser/dist/types/api-models'
import { MockTextractClient } from '../__mocks__/MockTextractClient'
import { response } from '../../test-data/short-risto-heikkinen/analyzeDocResponse'
import { env } from '../env'

const MIN_CONFIDENCE = 30

export type ContractData = {
  text: string
  checkboxes: Checkbox[]
}

type Checkbox = {
  isSelected: boolean
  label: string
}

let textractClient: TextractClient

if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
  textractClient = new MockTextractClient(response)
} else {
  const config = {
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  }

  textractClient = new TextractClient(config)
}

export async function getContractData(
  imageBuffers: Buffer[],
  client: TextractClient = textractClient,
): Promise<ContractData> {
  if (imageBuffers.length < 1) {
    throw new Error('No images provided to getContractData')
  }
  const imageBuffer = await combineImagesVertically(imageBuffers)
  const document = await analyzeDocument(imageBuffer, client)
  const text = getText(document)
  const checkboxes = getCheckboxes(document)
  return { text, checkboxes }
}

async function combineImagesVertically(imageBuffers: Buffer[]) {
  const combinedImage = await joinImages(imageBuffers, { direction: 'vertical' })
  const combinedBuffer = await combinedImage.png().toBuffer()
  return combinedBuffer
}

export async function analyzeDocument(
  imageBytes: Buffer,
  client: TextractClient = textractClient,
): Promise<TextractDocument> {
  const textractInput = {
    Document: {
      Bytes: imageBytes,
    },
    FeatureTypes: [FeatureType.FORMS],
  }
  const analyzeCommand = new AnalyzeDocumentCommand(textractInput)
  try {
    const response = await client.send(analyzeCommand)
    const document = createTextractDocument(response)
    return document
  } catch (error) {
    throw new Error(`Error analyzing document: ${error}`)
  }
}

export function getText(document: TextractDocument): string {
  let text = ''
  for (const block of document.listBlocks()) {
    if (block.BlockType === ApiBlockType.Line) {
      text += block.Text + '\n'
    }
  }

  return text
}

export function getCheckboxes(document: TextractDocument): Checkbox[] {
  const checkboxes = [] as Checkbox[]
  for (const field of document.form.iterFields()) {
    if (field.confidence < MIN_CONFIDENCE) {
      continue
    }
    if (field?.value) {
      for (const content of field.value.listContent()) {
        if (content instanceof SelectionElement) {
          const checkbox = {
            isSelected: content.selectionStatus === ApiSelectionStatus.Selected,
            label: field.key.text,
          }
          checkboxes.push(checkbox)
        }
      }
    }
  }
  return checkboxes
}

export function createTextractDocument(output: AnalyzeDocumentCommandOutput): TextractDocument {
  /*
  The ApiResponsePage input interface exposed and expected by this module is subtly different from - 
  but functionally compatible with - the output types produced by the AWS SDK for JavaScript Textract Client.
  https://github.com/aws-samples/amazon-textract-response-parser/tree/master/src-js#loading-data
  */
  const apiAnalyzeDocumentResponse = output as unknown as ApiAnalyzeDocumentResponse
  const document = new TextractDocument(apiAnalyzeDocumentResponse)
  return document
}
