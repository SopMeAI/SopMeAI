import { generateContractPrompt } from './promptService'

describe('generateContractPrompt', () => {
  it('should generate a prompt with the correct data', () => {
    const contractData = {
      text: 'This is some contract text Checkbox 1 Checkbox 2',
      checkboxes: [
        { isSelected: true, label: 'Checkbox 1' },
        { isSelected: false, label: 'Checkbox 2' },
      ],
    }
    const prompt = generateContractPrompt(contractData)

    expect(prompt).toContain('This is some contract text Checkbox 1 Checkbox 2')
    expect(prompt).toContain('Checkbox 1 Selected: true')
    expect(prompt).toContain('Checkbox 2 Selected: false')
  })
})
