import type { MaterialId } from '../../types/design'

export interface MaterialPricing {
  id: MaterialId
  /** Precio por m² de panel (madera/vidrio). */
  pricePerM2: number
  /** Precio por m³ (perfiles/estructura o sólidos). */
  pricePerM3: number
  /** Multiplicador de mano de obra sobre el subtotal de material. */
  laborFactor: number
}

/** Base de precios de referencia (CLP). */
export const MATERIAL_PRICING: Record<MaterialId, MaterialPricing> = {
  roble: {
    id: 'roble',
    pricePerM2: 45000,
    pricePerM3: 850000,
    laborFactor: 0.35,
  },
  pino: {
    id: 'pino',
    pricePerM2: 22000,
    pricePerM3: 420000,
    laborFactor: 0.3,
  },
  nogal: {
    id: 'nogal',
    pricePerM2: 58000,
    pricePerM3: 980000,
    laborFactor: 0.38,
  },
  mdf: {
    id: 'mdf',
    pricePerM2: 18000,
    pricePerM3: 320000,
    laborFactor: 0.28,
  },
  metal: {
    id: 'metal',
    pricePerM2: 35000,
    pricePerM3: 1200000,
    laborFactor: 0.4,
  },
  vidrio: {
    id: 'vidrio',
    pricePerM2: 65000,
    pricePerM3: 0,
    laborFactor: 0.25,
  },
}

export function getMaterialPricing(materialId: MaterialId): MaterialPricing {
  const pricing = MATERIAL_PRICING[materialId]
  if (!pricing) {
    throw new Error(`Material no soportado: ${materialId}`)
  }
  return pricing
}

export function roundMoney(value: number): number {
  return Math.round(value)
}

export function roundQty(value: number, digits = 4): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}
