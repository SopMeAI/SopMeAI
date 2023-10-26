import { simpleDocument, simpleOutput } from '../../test-data/textractTestResponses'
import { MockTextractClient } from '../__mocks__/MockTextractClient'
import { TextractDocument } from 'amazon-textract-response-parser'

import {
  getText,
  createTextractDocument,
  analyzeDocument,
  getContractData,
  getCheckboxes,
} from './contractAnalysisService'

const SIMPLE_IMAGE_PATH = './test-data/simple/simple.png'
import fs from 'fs'


describe('Contract Analysis Service', () => {
  it('should create a TextractDocument from a textract ouput', () => {
    const document = createTextractDocument(simpleOutput)
    expect(document).toBeDefined()
  })

  it('should get text from a TextractDocument', () => {
    const text = getText(simpleDocument)
    const expectedText =
      'Textract checkbox test\nThis checkbox has been checked\nThis checkbox has not been checked'
    expect(text.trim()).toBe(expectedText.trim())
  })

  it('should get checkboxes from a TextractDocument', () => {
    const checkboxes = getCheckboxes(simpleDocument)
    const expectedCheckboxes = [
      { isSelected: true, label: 'This checkbox has been checked' },
      { isSelected: false, label: 'This checkbox has not been checked' },
    ]
    expect(checkboxes).toEqual(expectedCheckboxes)
  })

  it('should get a TextractDocument from a Buffer', async () => {
    const mockClient = new MockTextractClient(simpleOutput)
    const imageBuffer = Buffer.from(SIMPLE_IMAGE_PATH)
    const document = await analyzeDocument(imageBuffer, mockClient)
    const correctType = document instanceof TextractDocument
    expect(correctType).toBe(true)
  })

  it('should throw an error if the buffer is not an image', async () => {
    const mockClient = new MockTextractClient(simpleOutput)
    const imageBuffer = [Buffer.from('not an image')]
    await expect(getContractData(imageBuffer, mockClient)).rejects.toThrow()
  })

  it('should get contract data from a single image Buffer', async () => {
    const mockClient = new MockTextractClient(simpleOutput)
    const simpleImage = fs.readFileSync(SIMPLE_IMAGE_PATH)
    const imageBuffers = [simpleImage]
    const contractData = await getContractData(imageBuffers, mockClient)
    const expectedData = {
      text: 'Textract checkbox test\nThis checkbox has been checked\nThis checkbox has not been checked\n',
      checkboxes: [
        { isSelected: true, label: 'This checkbox has been checked' },
        { isSelected: false, label: 'This checkbox has not been checked' },
      ],
    }
    expect(contractData).toEqual(expectedData)
  })

    it('should get contract data from multiple image Buffers', async () => {
    const mockClient = new MockTextractClient(simpleOutput)
    const simpleImage = fs.readFileSync(SIMPLE_IMAGE_PATH)
    const imageBuffers = [simpleImage, simpleImage]
    const contractData = await getContractData(imageBuffers, mockClient)
    const expectedData = {
      text: 'Textract checkbox test\nThis checkbox has been checked\nThis checkbox has not been checked\n',
      checkboxes: [
        { isSelected: true, label: 'This checkbox has been checked' },
        { isSelected: false, label: 'This checkbox has not been checked' },
      ],
    }
    expect(contractData).toEqual(expectedData)
  })
})
