import type {
  ClosetDimensions,
  ClosetOptions,
  DeskDimensions,
  DiningTableDimensions,
  StructureDimensions,
  StructureOptions,
} from '../../types/design'
import type { QuoteLineItem, QuoteResult } from '../../types/quote'
import { getMaterialPricing, roundMoney, roundQty } from './pricing'

function line(
  id: string,
  label: string,
  quantity: number,
  unit: QuoteLineItem['unit'],
  unitPrice: number,
): QuoteLineItem {
  const qty = roundQty(quantity)
  return {
    id,
    label,
    quantity: qty,
    unit,
    unitPrice,
    total: roundMoney(qty * unitPrice),
  }
}

function finalize(
  tipo: QuoteResult['tipo'],
  materialId: QuoteResult['materialId'],
  items: QuoteLineItem[],
  totalAreaM2: number,
  totalVolumeM3: number,
): QuoteResult {
  const pricing = getMaterialPricing(materialId)
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.total, 0))
  const labor = roundMoney(subtotal * pricing.laborFactor)
  return {
    tipo,
    materialId,
    currency: 'CLP',
    items,
    totalAreaM2: roundQty(totalAreaM2, 4),
    totalVolumeM3: roundQty(totalVolumeM3, 5),
    subtotal,
    labor,
    total: roundMoney(subtotal + labor),
    calculatedAt: new Date().toISOString(),
  }
}

/** Escritorio: superficie superior + 4 patas (volumen). */
export function calculateDeskQuote(
  dimensions: DeskDimensions,
  materialId: QuoteResult['materialId'],
): QuoteResult {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions
  const topArea = L * W
  const legSize = Math.max(0.04, T * 1.4)
  const legHeight = Math.max(0.05, H - T)
  const legsVolume = 4 * legSize * legSize * legHeight

  const items = [
    line('top', 'Cubierta / tablero', topArea, 'm2', pricing.pricePerM2),
    line('legs', 'Patas (4 uds)', legsVolume, 'm3', pricing.pricePerM3 || pricing.pricePerM2 * 20),
  ]

  return finalize('escritorio', materialId, items, topArea, legsVolume)
}

/** Comedor: tablero + faldón + patas. */
export function calculateDiningQuote(
  dimensions: DiningTableDimensions,
  materialId: QuoteResult['materialId'],
): QuoteResult {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions
  const topArea = L * W
  const apronArea = 2 * (L + W) * (T * 2) // aproximación de faldón perimetral
  const legSize = Math.max(0.05, T * 1.5)
  const legHeight = Math.max(0.05, H - T)
  const legsVolume = 4 * legSize * legSize * legHeight

  const items = [
    line('top', 'Tablero de comedor', topArea, 'm2', pricing.pricePerM2),
    line('apron', 'Faldón perimetral', apronArea, 'm2', pricing.pricePerM2),
    line('legs', 'Patas (4 uds)', legsVolume, 'm3', pricing.pricePerM3 || pricing.pricePerM2 * 20),
  ]

  return finalize('comedor', materialId, items, topArea + apronArea, legsVolume)
}

/**
 * Closet: suma de paneles laterales, techo, base, fondo, estantes y divisiones.
 * Cada panel se cotiza por área (m²).
 */
export function calculateClosetQuote(
  dimensions: ClosetDimensions,
  options: ClosetOptions,
  materialId: QuoteResult['materialId'],
): QuoteResult {
  const pricing = getMaterialPricing(materialId)
  const { length: L, height: H, depth: D, thickness: T } = dimensions
  const shelves = Math.max(0, Math.round(options.shelves))
  const divisions = Math.max(0, Math.round(options.verticalDivisions))

  const sideArea = 2 * (H * D)
  const topBottomArea = 2 * (L * D)
  const backArea = L * H
  const innerWidth = Math.max(0, L - 2 * T)
  const shelfArea = shelves * (innerWidth * Math.max(0, D - T))
  const divisionArea = divisions * (Math.max(0, H - 2 * T) * Math.max(0, D - T))

  const items = [
    line('sides', 'Paneles laterales', sideArea, 'm2', pricing.pricePerM2),
    line('top-bottom', 'Techo y base', topBottomArea, 'm2', pricing.pricePerM2),
    line('back', 'Fondo', backArea, 'm2', pricing.pricePerM2),
    line('shelves', `Estantes (${shelves})`, shelfArea, 'm2', pricing.pricePerM2),
    line('divisions', `Divisiones verticales (${divisions})`, divisionArea, 'm2', pricing.pricePerM2),
  ]

  const totalArea = sideArea + topBottomArea + backArea + shelfArea + divisionArea
  const totalVolume = totalArea * T

  return finalize('closet', materialId, items, totalArea, totalVolume)
}

/** Estructura: pilares y vigas por volumen de perfil. */
export function calculateStructureQuote(
  dimensions: StructureDimensions,
  options: StructureOptions,
  materialId: QuoteResult['materialId'],
): QuoteResult {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, profileThickness: P } = dimensions
  const beamCount = Math.max(1, Math.round(options.beamCount))
  const spacing = Math.max(0.5, options.pillarSpacing)

  const pillarsAlong = Math.max(2, Math.floor(L / spacing) + 1)
  const pillarsAcross = 2
  const pillarCount = pillarsAlong * pillarsAcross
  const pillarVolume = pillarCount * (P * P * H)

  // Por nivel: 2 vigas longitudinales + N transversales
  const longBeamsPerLevel = 2
  const crossBeamsPerLevel = pillarsAlong
  const longBeamVolume = beamCount * longBeamsPerLevel * (P * P * (L + P))
  const crossBeamVolume = beamCount * crossBeamsPerLevel * (P * P * (W + P))
  const beamsVolume = longBeamVolume + crossBeamVolume

  const unitPrice = pricing.pricePerM3 || pricing.pricePerM2 * 25

  const items = [
    line('pillars', `Pilares (${pillarCount})`, pillarVolume, 'm3', unitPrice),
    line('beams', `Vigas (${beamCount} niveles)`, beamsVolume, 'm3', unitPrice),
  ]

  return finalize('estructura', materialId, items, 0, pillarVolume + beamsVolume)
}
