import type {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandOutput,
} from '@aws-sdk/client-textract'

export class MockTextractClient implements TextractClient {
  private readonly response: AnalyzeDocumentCommandOutput
  constructor(response: AnalyzeDocumentCommandOutput) {
    this.response = response
  }
  async send(_command: AnalyzeDocumentCommand): Promise<AnalyzeDocumentCommandOutput> {
    return Promise.resolve(this.response)
  }
  config: any
  middlewareStack: any
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}
