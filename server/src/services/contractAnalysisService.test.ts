import { MockTextractClient } from '../mocks/MockTextractClient'

import {
  getContractData,
  analyzeDocument,
  getText,
  getCheckboxes,
  contractDataToString,
} from './contractAnalysisService'

describe('Contract Analysis Service', () => {
  const mockResponse = {
    Blocks: [
      { BlockType: 'LINE', Text: 'Sample text' },
      { BlockType: 'LINE', Text: 'Option 1' },
      { BlockType: 'LINE', Text: 'Option 2' },
      { BlockType: 'SELECTION_ELEMENT', SelectionStatus: 'SELECTED', Text: 'Option 1' },
      { BlockType: 'SELECTION_ELEMENT', SelectionStatus: 'NOT_SELECTED', Text: 'Option 2' },
    ],
    $metadata: {
      httpStatusCode: 200,
    },
  }

  it('should analyze the contract image and return blocks', async () => {
    const mockTextractClient = new MockTextractClient(mockResponse)
    const blocks = await analyzeDocument(Buffer.from('fakeImageData'), mockTextractClient)
    expect(blocks).toEqual(mockResponse.Blocks)
  })

  it('should extract text from blocks', () => {
    const blocks = [
      { BlockType: 'LINE', Text: 'Sample text' },
      { BlockType: 'LINE', Text: 'More text' },
    ]
    const text = getText(blocks)
    expect(text).toBe('Sample text\nMore text')
  })

  it('should extract checkboxes from blocks', () => {
    const blocks = [
      { BlockType: 'SELECTION_ELEMENT', SelectionStatus: 'SELECTED', Text: 'Option 1' },
      { BlockType: 'SELECTION_ELEMENT', SelectionStatus: 'NOT_SELECTED', Text: 'Option 2' },
    ]
    const checkboxes = getCheckboxes(blocks)
    expect(checkboxes).toEqual([
      { isSelected: true, label: 'Option 1' },
      { isSelected: false, label: 'Option 2' },
    ])
  })

  it('should process contract image data and return text and checkboxes', async () => {
    const textractClient = new MockTextractClient(mockResponse)
    const imageData = Buffer.from('fakeImageData')
    const result = await getContractData(imageData, textractClient)

    expect(result).toEqual({
      text: 'Sample text\nOption 1\nOption 2',
      checkboxes: [
        { isSelected: true, label: 'Option 1' },
        { isSelected: false, label: 'Option 2' },
      ],
    })
  })

  it('should convert contract data to a string', () => {
    const contractData = {
      text: 'Sample text\nOption 1\nOption 2',
      checkboxes: [
        { isSelected: true, label: 'Option 1' },
        { isSelected: false, label: 'Option 2' },
      ],
    }

    const expectedText = `Text:
Sample text
Option 1
Option 2

Checkboxes:
[
  {
    "isSelected": true,
    "label": "Option 1"
  },
  {
    "isSelected": false,
    "label": "Option 2"
  }
]`

    const result = contractDataToString(contractData)
    expect(result).toBe(expectedText)
  })
})
