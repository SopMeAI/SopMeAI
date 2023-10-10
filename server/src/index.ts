import app from './app'
import { env } from './env'
// import { getContractData, contractDataToString } from './services/contractAnalysisService'
// import fs from 'fs'

// async function testContractAnalysis() {
//   const path = 'test-data/lease-aws/lease.png'
//   const contract = fs.readFileSync(path)
//   const contractData = await getContractData(contract)
//   contractDataToString(contractData)
// }

// testContractAnalysis()

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`)
})
