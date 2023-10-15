import type { AnalyzeDocumentCommandOutput } from '@aws-sdk/client-textract'
import { simpleResponse } from './simple/analyzeDocResponse'
import { leaseResponse } from './lease/analyzeDocResponse'
import { createTextractDocument } from '../src/services/contractAnalysisService'

export const simpleOutput = simpleResponse as AnalyzeDocumentCommandOutput
export const leaseOutput = leaseResponse as AnalyzeDocumentCommandOutput

export const simpleDocument = createTextractDocument(simpleOutput)
export const leaseDocument = createTextractDocument(leaseOutput)
