import type { DesignCategory, MaterialId } from '../../types/design'
import type { QuoteRequest } from '../../types/quote'
import type {
  ClosetDimensions,
  ClosetOptions,
  DeskDimensions,
  DiningTableDimensions,
  StructureDimensions,
  StructureOptions,
} from '../../types/design'

export interface DesignSnapshotForQuote {
  category: DesignCategory
  materialId: MaterialId
  desk: DeskDimensions
  dining: DiningTableDimensions
  closet: ClosetDimensions
  closetOptions: ClosetOptions
  structure: StructureDimensions
  structureOptions: StructureOptions
}

export function buildQuoteRequest(state: DesignSnapshotForQuote): QuoteRequest {
  switch (state.category) {
    case 'escritorio':
      return {
        tipo: 'escritorio',
        dimensiones: state.desk,
        materialId: state.materialId,
      }
    case 'comedor':
      return {
        tipo: 'comedor',
        dimensiones: state.dining,
        materialId: state.materialId,
      }
    case 'closet':
      return {
        tipo: 'closet',
        dimensiones: state.closet,
        opciones: state.closetOptions,
        materialId: state.materialId,
      }
    case 'estructura':
      return {
        tipo: 'estructura',
        dimensiones: state.structure,
        opciones: state.structureOptions,
        materialId: state.materialId,
      }
    default: {
      const _exhaustive: never = state.category
      return _exhaustive
    }
  }
}
