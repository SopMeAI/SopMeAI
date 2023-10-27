import fs from 'fs'
import path from 'path'
import { getContractData } from '../../src/services/contractAnalysisService'

async function createContractData(folder: string) {
  const currentDirectory = process.cwd()
  const folderPath = path.join(currentDirectory, 'test-data', folder)
  const imagePath = `${folderPath}/image.png`

  if (fs.existsSync(imagePath)) {
    console.log(`creating contract data from ${imagePath}`)
    const imageBuffer = fs.readFileSync(imagePath)
    try {
      const contractData = await getContractData(imageBuffer)
      const contractDataPath = `${folderPath}/contractData.json`
      fs.writeFileSync(contractDataPath, JSON.stringify(contractData))
      console.log(`contract data written to ${contractDataPath}`)
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log(`image not found at ${imagePath}`)
    return
  }
}

if (process.argv.length < 3) {
  console.log('Usage: ts-node-dev createContractData.ts <test-data-folder-name>')
} else {
  const folder = process.argv[2]
  createContractData(folder)
}
