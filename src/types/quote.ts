import type {
  ClosetDimensions,
  ClosetOptions,
  DesignCategory,
  DeskDimensions,
  DiningTableDimensions,
  MaterialId,
  StructureDimensions,
  StructureOptions,
} from './design'

export type QuoteCurrency = 'CLP'

export interface QuoteLineItem {
  id: string
  label: string
  /** Cantidad de material en la unidad indicada. */
  quantity: number
  unit: 'm2' | 'm3' | 'uds'
  unitPrice: number
  total: number
}

export interface QuoteResult {
  tipo: DesignCategory
  materialId: MaterialId
  currency: QuoteCurrency
  items: QuoteLineItem[]
  /** Área total de paneles (m²), si aplica. */
  totalAreaM2: number
  /** Volumen total (m³), si aplica. */
  totalVolumeM3: number
  subtotal: number
  labor: number
  total: number
  calculatedAt: string
}

export type QuoteRequest =
  | {
      tipo: 'escritorio'
      dimensiones: DeskDimensions
      materialId: MaterialId
    }
  | {
      tipo: 'comedor'
      dimensiones: DiningTableDimensions
      materialId: MaterialId
    }
  | {
      tipo: 'closet'
      dimensiones: ClosetDimensions
      opciones: ClosetOptions
      materialId: MaterialId
    }
  | {
      tipo: 'estructura'
      dimensiones: StructureDimensions
      opciones: StructureOptions
      materialId: MaterialId
    }

export interface QuoteErrorResponse {
  error: string
  details?: string
}
