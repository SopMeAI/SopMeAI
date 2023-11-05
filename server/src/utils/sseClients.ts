import { Response } from 'express'

let clients: { id: string; response: Response }[] = []

export function addClient(res: Response): string {
  const clientId = Date.now().toString()
  const newClient = { id: clientId, response: res }
  clients.push(newClient)
  return clientId
}

export function removeClient(clientId: string): void {
  clients = clients.filter((client) => client.id !== clientId)
}

export function sendUpdates(data: string): void {
  clients.forEach((client) => {
    client.response.write(`data: ${JSON.stringify({ message: data })}\n\n`)
  })
}
