const CATEGORIES = ['escritorio', 'closet', 'comedor', 'estructura']
const MATERIALS = ['roble', 'pino', 'nogal', 'mdf', 'metal', 'vidrio']

const MATERIAL_PRICING = {
  roble: { id: 'roble', pricePerM2: 45000, pricePerM3: 850000, laborFactor: 0.35 },
  pino: { id: 'pino', pricePerM2: 22000, pricePerM3: 420000, laborFactor: 0.3 },
  nogal: { id: 'nogal', pricePerM2: 58000, pricePerM3: 980000, laborFactor: 0.38 },
  mdf: { id: 'mdf', pricePerM2: 18000, pricePerM3: 320000, laborFactor: 0.28 },
  metal: { id: 'metal', pricePerM2: 35000, pricePerM3: 1200000, laborFactor: 0.4 },
  vidrio: { id: 'vidrio', pricePerM2: 65000, pricePerM3: 0, laborFactor: 0.25 },
}

function getMaterialPricing(materialId) {
  const pricing = MATERIAL_PRICING[materialId]
  if (!pricing) throw new Error(`Material no soportado: ${materialId}`)
  return pricing
}

function roundMoney(value) {
  return Math.round(value)
}

function roundQty(value, digits = 4) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function line(id, label, quantity, unit, unitPrice) {
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

function finalize(tipo, materialId, items, totalAreaM2, totalVolumeM3) {
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

function calculateDeskQuote(dimensions, materialId) {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions
  const topArea = L * W
  const legSize = Math.max(0.04, T * 1.4)
  const legHeight = Math.max(0.05, H - T)
  const legsVolume = 4 * legSize * legSize * legHeight
  return finalize(
    'escritorio',
    materialId,
    [
      line('top', 'Cubierta / tablero', topArea, 'm2', pricing.pricePerM2),
      line(
        'legs',
        'Patas (4 uds)',
        legsVolume,
        'm3',
        pricing.pricePerM3 || pricing.pricePerM2 * 20,
      ),
    ],
    topArea,
    legsVolume,
  )
}

function calculateDiningQuote(dimensions, materialId) {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions
  const topArea = L * W
  const apronArea = 2 * (L + W) * (T * 2)
  const legSize = Math.max(0.05, T * 1.5)
  const legHeight = Math.max(0.05, H - T)
  const legsVolume = 4 * legSize * legSize * legHeight
  return finalize(
    'comedor',
    materialId,
    [
      line('top', 'Tablero de comedor', topArea, 'm2', pricing.pricePerM2),
      line('apron', 'Faldón perimetral', apronArea, 'm2', pricing.pricePerM2),
      line(
        'legs',
        'Patas (4 uds)',
        legsVolume,
        'm3',
        pricing.pricePerM3 || pricing.pricePerM2 * 20,
      ),
    ],
    topArea + apronArea,
    legsVolume,
  )
}

function calculateClosetQuote(dimensions, options, materialId) {
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
  const totalArea = sideArea + topBottomArea + backArea + shelfArea + divisionArea
  return finalize(
    'closet',
    materialId,
    [
      line('sides', 'Paneles laterales', sideArea, 'm2', pricing.pricePerM2),
      line('top-bottom', 'Techo y base', topBottomArea, 'm2', pricing.pricePerM2),
      line('back', 'Fondo', backArea, 'm2', pricing.pricePerM2),
      line('shelves', `Estantes (${shelves})`, shelfArea, 'm2', pricing.pricePerM2),
      line(
        'divisions',
        `Divisiones verticales (${divisions})`,
        divisionArea,
        'm2',
        pricing.pricePerM2,
      ),
    ],
    totalArea,
    totalArea * T,
  )
}

function calculateStructureQuote(dimensions, options, materialId) {
  const pricing = getMaterialPricing(materialId)
  const { length: L, width: W, height: H, profileThickness: P } = dimensions
  const beamCount = Math.max(1, Math.round(options.beamCount))
  const spacing = Math.max(0.5, options.pillarSpacing)
  const pillarsAlong = Math.max(2, Math.floor(L / spacing) + 1)
  const pillarCount = pillarsAlong * 2
  const pillarVolume = pillarCount * (P * P * H)
  const beamsVolume =
    beamCount * 2 * (P * P * (L + P)) + beamCount * pillarsAlong * (P * P * (W + P))
  const unitPrice = pricing.pricePerM3 || pricing.pricePerM2 * 25
  return finalize(
    'estructura',
    materialId,
    [
      line('pillars', `Pilares (${pillarCount})`, pillarVolume, 'm3', unitPrice),
      line('beams', `Vigas (${beamCount} niveles)`, beamsVolume, 'm3', unitPrice),
    ],
    0,
    pillarVolume + beamsVolume,
  )
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireNumber(obj, key, label) {
  const value = obj[key]
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número válido`)
  }
  if (value <= 0) throw new Error(`${label} debe ser mayor que 0`)
  return value
}

function requireNonNegativeInt(obj, key, label) {
  const value = obj[key]
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número válido`)
  }
  if (value < 0) throw new Error(`${label} no puede ser negativo`)
  return Math.round(value)
}

function parseQuoteRequest(body) {
  if (!isRecord(body)) throw new Error('El body debe ser un objeto JSON')
  const { tipo, materialId, dimensiones, opciones } = body
  if (typeof tipo !== 'string' || !CATEGORIES.includes(tipo)) {
    throw new Error('tipo de diseño inválido')
  }
  if (typeof materialId !== 'string' || !MATERIALS.includes(materialId)) {
    throw new Error('materialId inválido')
  }
  if (!isRecord(dimensiones)) throw new Error('dimensiones es requerido')

  if (tipo === 'escritorio' || tipo === 'comedor') {
    return {
      tipo,
      dimensiones: {
        length: requireNumber(dimensiones, 'length', 'Largo'),
        width: requireNumber(dimensiones, 'width', 'Ancho'),
        height: requireNumber(dimensiones, 'height', 'Alto'),
        thickness: requireNumber(dimensiones, 'thickness', 'Grosor'),
      },
      materialId,
    }
  }

  if (tipo === 'closet') {
    if (!isRecord(opciones)) throw new Error('opciones es requerido para closet')
    return {
      tipo: 'closet',
      dimensiones: {
        length: requireNumber(dimensiones, 'length', 'Largo'),
        height: requireNumber(dimensiones, 'height', 'Alto'),
        depth: requireNumber(dimensiones, 'depth', 'Profundidad'),
        thickness: requireNumber(dimensiones, 'thickness', 'Grosor'),
      },
      opciones: {
        shelves: requireNonNegativeInt(opciones, 'shelves', 'Estantes'),
        verticalDivisions: requireNonNegativeInt(
          opciones,
          'verticalDivisions',
          'Divisiones verticales',
        ),
      },
      materialId,
    }
  }

  if (!isRecord(opciones)) throw new Error('opciones es requerido para estructura')
  return {
    tipo: 'estructura',
    dimensiones: {
      length: requireNumber(dimensiones, 'length', 'Largo'),
      width: requireNumber(dimensiones, 'width', 'Ancho'),
      height: requireNumber(dimensiones, 'height', 'Alto'),
      profileThickness: requireNumber(
        dimensiones,
        'profileThickness',
        'Grosor del perfil',
      ),
    },
    opciones: {
      beamCount: Math.max(
        1,
        requireNonNegativeInt(opciones, 'beamCount', 'Cantidad de vigas'),
      ),
      pillarSpacing: requireNumber(
        opciones,
        'pillarSpacing',
        'Distancia entre pilares',
      ),
    },
    materialId,
  }
}

function calculateQuote(request) {
  switch (request.tipo) {
    case 'escritorio':
      return calculateDeskQuote(request.dimensiones, request.materialId)
    case 'comedor':
      return calculateDiningQuote(request.dimensiones, request.materialId)
    case 'closet':
      return calculateClosetQuote(
        request.dimensiones,
        request.opciones,
        request.materialId,
      )
    case 'estructura':
      return calculateStructureQuote(
        request.dimensiones,
        request.opciones,
        request.materialId,
      )
    default:
      throw new Error(`No hay estrategia de cotización para: ${request.tipo}`)
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido. Usa POST.' })
    return
  }

  try {
    const request = parseQuoteRequest(req.body)
    const quote = calculateQuote(request)
    res.status(200).json(quote)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al calcular la cotización'
    res.status(400).json({ error: message })
  }
}
