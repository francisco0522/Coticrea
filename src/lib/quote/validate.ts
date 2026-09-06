import type { DesignCategory, MaterialId } from '../../types/design'
import type { QuoteRequest } from '../../types/quote'

const CATEGORIES: DesignCategory[] = [
  'escritorio',
  'closet',
  'comedor',
  'estructura',
]

const MATERIALS: MaterialId[] = [
  'roble',
  'pino',
  'nogal',
  'mdf',
  'metal',
  'vidrio',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireNumber(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): number {
  const value = obj[key]
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número válido`)
  }
  if (value <= 0) {
    throw new Error(`${label} debe ser mayor que 0`)
  }
  return value
}

function requireNonNegativeInt(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): number {
  const value = obj[key]
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número válido`)
  }
  if (value < 0) {
    throw new Error(`${label} no puede ser negativo`)
  }
  return Math.round(value)
}

export function parseQuoteRequest(body: unknown): QuoteRequest {
  if (!isRecord(body)) {
    throw new Error('El body debe ser un objeto JSON')
  }

  const tipo = body.tipo
  if (typeof tipo !== 'string' || !CATEGORIES.includes(tipo as DesignCategory)) {
    throw new Error('tipo de diseño inválido')
  }

  const materialId = body.materialId
  if (
    typeof materialId !== 'string' ||
    !MATERIALS.includes(materialId as MaterialId)
  ) {
    throw new Error('materialId inválido')
  }

  if (!isRecord(body.dimensiones)) {
    throw new Error('dimensiones es requerido')
  }

  const dims = body.dimensiones
  const mat = materialId as MaterialId

  switch (tipo as DesignCategory) {
    case 'escritorio':
    case 'comedor': {
      const dimensiones = {
        length: requireNumber(dims, 'length', 'Largo'),
        width: requireNumber(dims, 'width', 'Ancho'),
        height: requireNumber(dims, 'height', 'Alto'),
        thickness: requireNumber(dims, 'thickness', 'Grosor'),
      }
      return {
        tipo: tipo as 'escritorio' | 'comedor',
        dimensiones,
        materialId: mat,
      }
    }
    case 'closet': {
      if (!isRecord(body.opciones)) {
        throw new Error('opciones es requerido para closet')
      }
      return {
        tipo: 'closet',
        dimensiones: {
          length: requireNumber(dims, 'length', 'Largo'),
          height: requireNumber(dims, 'height', 'Alto'),
          depth: requireNumber(dims, 'depth', 'Profundidad'),
          thickness: requireNumber(dims, 'thickness', 'Grosor'),
        },
        opciones: {
          shelves: requireNonNegativeInt(body.opciones, 'shelves', 'Estantes'),
          verticalDivisions: requireNonNegativeInt(
            body.opciones,
            'verticalDivisions',
            'Divisiones verticales',
          ),
        },
        materialId: mat,
      }
    }
    case 'estructura': {
      if (!isRecord(body.opciones)) {
        throw new Error('opciones es requerido para estructura')
      }
      return {
        tipo: 'estructura',
        dimensiones: {
          length: requireNumber(dims, 'length', 'Largo'),
          width: requireNumber(dims, 'width', 'Ancho'),
          height: requireNumber(dims, 'height', 'Alto'),
          profileThickness: requireNumber(
            dims,
            'profileThickness',
            'Grosor del perfil',
          ),
        },
        opciones: {
          beamCount: Math.max(
            1,
            requireNonNegativeInt(body.opciones, 'beamCount', 'Cantidad de vigas'),
          ),
          pillarSpacing: requireNumber(
            body.opciones,
            'pillarSpacing',
            'Distancia entre pilares',
          ),
        },
        materialId: mat,
      }
    }
    default: {
      const _exhaustive: never = tipo as never
      return _exhaustive
    }
  }
}
