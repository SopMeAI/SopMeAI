import type {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandOutput,
} from '@aws-sdk/client-textract'

export class MockTextractClient implements TextractClient {
  private readonly response
  constructor(response: any) {
    this.response = response
  }
  async send(_command: AnalyzeDocumentCommand): Promise<AnalyzeDocumentCommandOutput> {
    const output = {
      ...this.response,
      $metadata: {},
    }
    return Promise.resolve(output)
  }
  config: any
  middlewareStack: any
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}
