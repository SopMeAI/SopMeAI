import fs from 'fs'
import path from 'path'
import { getContractData } from '../../src/services/contractAnalysisService'

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']

async function createContractData(folder: string) {
  const currentDirectory = process.cwd()
  const folderPath = path.join(currentDirectory, 'test-data', folder)
  const imageBuffers = getImageBuffers(folderPath)
  try {
    if (imageBuffers.length === 0) {
      throw new Error(`no images found in ${folderPath}`)
    }
    const contractData = await getContractData(imageBuffers)
    const contractDataPath = `${folderPath}/contractData.json`
    fs.writeFileSync(contractDataPath, JSON.stringify(contractData))
    console.log(`contract data written to ${contractDataPath}`)
  } catch (error) {
    console.log(error)
  }
}

function getImageBuffers(folderPath: string) {
  const files = fs.readdirSync(folderPath)
  const imageBuffers: Buffer[] = []
  for (const file of files) {
    const filePath = path.join(folderPath, file)
    if (
      fs.lstatSync(filePath).isFile() &&
      IMAGE_EXTENSIONS.includes(path.extname(filePath).toLowerCase())
    ) {
      console.log(`creating contract data from ${filePath}`)
      const imageBuffer = fs.readFileSync(filePath)
      imageBuffers.push(imageBuffer)
    }
  }
  return imageBuffers
}

if (process.argv.length < 3) {
  console.log('Usage: ts-node-dev createContractData.ts <test-data-folder-name>')
} else {
  const folder = process.argv[2]
  createContractData(folder).catch((error) => {
    console.log(error)
  })
}
