import type { ContractData } from './contractAnalysisService'

export function generateContractPrompt(contractData: ContractData): string {
  const prefix = `This is a lease contract.
The following text has been extracted from a contract photo using an OCR service. 
In addition to raw text I have extracted which checkboxes are checked in the contract. 
Please review the contract and give me a summary of it and highlight any sections that require extra caution or attention. Do not mention checkboxes or OCR in your response.`
  const checkBoxesString = contractData.checkboxes.map((checkbox) => {
    return `\nLabel: ${checkbox.label} Selected: ${checkbox.isSelected}`
  })
  const data = `OCR text:\n${contractData.text}\nCheckbox data:${checkBoxesString}`
  const prompt = `${prefix}\n${data}`
  return prompt
}
