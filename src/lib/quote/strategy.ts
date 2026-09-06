import type { QuoteRequest, QuoteResult } from '../../types/quote'
import {
  calculateClosetQuote,
  calculateDeskQuote,
  calculateDiningQuote,
  calculateStructureQuote,
} from './calculators'

export interface QuoteStrategy {
  calculate(request: QuoteRequest): QuoteResult
}

const deskStrategy: QuoteStrategy = {
  calculate(request) {
    if (request.tipo !== 'escritorio') {
      throw new Error('Estrategia de escritorio recibió un tipo inválido')
    }
    return calculateDeskQuote(request.dimensiones, request.materialId)
  },
}

const diningStrategy: QuoteStrategy = {
  calculate(request) {
    if (request.tipo !== 'comedor') {
      throw new Error('Estrategia de comedor recibió un tipo inválido')
    }
    return calculateDiningQuote(request.dimensiones, request.materialId)
  },
}

const closetStrategy: QuoteStrategy = {
  calculate(request) {
    if (request.tipo !== 'closet') {
      throw new Error('Estrategia de closet recibió un tipo inválido')
    }
    return calculateClosetQuote(
      request.dimensiones,
      request.opciones,
      request.materialId,
    )
  },
}

const structureStrategy: QuoteStrategy = {
  calculate(request) {
    if (request.tipo !== 'estructura') {
      throw new Error('Estrategia de estructura recibió un tipo inválido')
    }
    return calculateStructureQuote(
      request.dimensiones,
      request.opciones,
      request.materialId,
    )
  },
}

const STRATEGIES: Record<QuoteRequest['tipo'], QuoteStrategy> = {
  escritorio: deskStrategy,
  comedor: diningStrategy,
  closet: closetStrategy,
  estructura: structureStrategy,
}

export function getQuoteStrategy(tipo: QuoteRequest['tipo']): QuoteStrategy {
  const strategy = STRATEGIES[tipo]
  if (!strategy) {
    throw new Error(`No hay estrategia de cotización para: ${tipo}`)
  }
  return strategy
}

export function calculateQuote(request: QuoteRequest): QuoteResult {
  return getQuoteStrategy(request.tipo).calculate(request)
}
