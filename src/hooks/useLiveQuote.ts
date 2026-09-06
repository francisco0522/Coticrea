import { useEffect, useMemo, useState } from 'react'
import { buildQuoteRequest } from '../lib/quote'
import { useDesignStore } from '../store/designStore'
import type { QuoteErrorResponse, QuoteResult } from '../types/quote'

interface LiveQuoteState {
  quote: QuoteResult | null
  loading: boolean
  error: string | null
}

const DEBOUNCE_MS = 280

async function fetchQuote(payload: unknown): Promise<QuoteResult> {
  const response = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as QuoteResult | QuoteErrorResponse

  if (!response.ok) {
    const message =
      'error' in data && typeof data.error === 'string'
        ? data.error
        : 'No se pudo calcular la cotización'
    throw new Error(message)
  }

  return data as QuoteResult
}

export function useLiveQuote(): LiveQuoteState {
  const category = useDesignStore((state) => state.category)
  const materialId = useDesignStore((state) => state.materialId)
  const desk = useDesignStore((state) => state.desk)
  const dining = useDesignStore((state) => state.dining)
  const closet = useDesignStore((state) => state.closet)
  const closetOptions = useDesignStore((state) => state.closetOptions)
  const structure = useDesignStore((state) => state.structure)
  const structureOptions = useDesignStore((state) => state.structureOptions)

  const request = useMemo(
    () =>
      buildQuoteRequest({
        category,
        materialId,
        desk,
        dining,
        closet,
        closetOptions,
        structure,
        structureOptions,
      }),
    [
      category,
      materialId,
      desk,
      dining,
      closet,
      closetOptions,
      structure,
      structureOptions,
    ],
  )

  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      setLoading(true)
      setError(null)

      fetchQuote(request)
        .then((result) => {
          if (!cancelled) {
            setQuote(result)
            setLoading(false)
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Error de cotización')
            setLoading(false)
          }
        })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [request])

  return { quote, loading, error }
}
