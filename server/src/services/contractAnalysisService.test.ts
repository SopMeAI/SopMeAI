import { TextractDocument } from 'amazon-textract-response-parser'
import { simpleDocument, simpleOutput } from '../../test-data/helpers/textractTestResponses'
import { MockTextractClient } from '../__mocks__/MockTextractClient'
import {
  getText,
  createTextractDocument,
  analyzeDocument,
  getContractData,
  getCheckboxes,
  getContractDataString,
} from './contractAnalysisService'

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
    const imageBuffer = Buffer.from('./test-data/simple/simple.png')
    const document = await analyzeDocument(imageBuffer, mockClient)
    const correctType = document instanceof TextractDocument
    expect(correctType).toBe(true)
  })

  it('should get contract data from a Buffer', async () => {
    const mockClient = new MockTextractClient(simpleOutput)
    const imageBuffer = Buffer.from('./test-data/simple/simple.png')
    const contractData = await getContractData(imageBuffer, mockClient)
    const expectedData = {
      text: 'Textract checkbox test\nThis checkbox has been checked\nThis checkbox has not been checked\n',
      checkboxes: [
        { isSelected: true, label: 'This checkbox has been checked' },
        { isSelected: false, label: 'This checkbox has not been checked' },
      ],
    }
    expect(contractData).toEqual(expectedData)
  })

  it('should return contract data as a string', () => {
    const contractData = {
      text: 'Textract checkbox test\nThis checkbox has been checked\nThis checkbox has not been checked\n',
      checkboxes: [
        { isSelected: true, label: 'This checkbox has been checked' },
        { isSelected: false, label: 'This checkbox has not been checked' },
      ],
    }
    const expectedString = `Text:
Textract checkbox test
This checkbox has been checked
This checkbox has not been checked

Checkboxes:
[
  {
    "isSelected": true,
    "label": "This checkbox has been checked"
  },
  {
    "isSelected": false,
    "label": "This checkbox has not been checked"
  }
]`
    const contractDataString = getContractDataString(contractData)

    expect(contractDataString).toEqual(expectedString)
  })
})
