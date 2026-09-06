import type { VercelRequest, VercelResponse } from '@vercel/node'
import { calculateQuote, parseQuoteRequest } from '../src/lib/quote'

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' })
  }

  try {
    const request = parseQuoteRequest(req.body)
    const quote = calculateQuote(request)
    return res.status(200).json(quote)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al calcular la cotización'
    return res.status(400).json({ error: message })
  }
}
