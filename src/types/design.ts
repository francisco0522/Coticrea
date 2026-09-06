/** Categorías de diseño soportadas por la plataforma. */
export type DesignCategory = 'escritorio' | 'closet' | 'comedor' | 'estructura'

/** Identificadores de material disponibles. */
export type MaterialId =
  | 'roble'
  | 'pino'
  | 'nogal'
  | 'mdf'
  | 'metal'
  | 'vidrio'

export type MaterialFinish = 'natural' | 'mate' | 'brillante' | 'lacado'

export interface MaterialOption {
  id: MaterialId
  label: string
  finish: MaterialFinish
  /** Color hex usado en el visor 3D (placeholder hasta texturas). */
  color: string
  category: 'madera' | 'metal' | 'vidrio'
}

/** Dimensiones comunes expresadas en metros. */
export interface BaseDimensions {
  length: number
  width: number
  height: number
  thickness: number
}

export interface DeskDimensions extends BaseDimensions {}

export interface DiningTableDimensions extends BaseDimensions {}

export interface ClosetDimensions {
  length: number
  height: number
  depth: number
  thickness: number
}

export interface StructureDimensions {
  length: number
  height: number
  width: number
  profileThickness: number
}

export interface ClosetOptions {
  shelves: number
  verticalDivisions: number
}

export interface StructureOptions {
  beamCount: number
  pillarSpacing: number
}

export type CategoryDimensions =
  | { category: 'escritorio'; dimensions: DeskDimensions }
  | { category: 'comedor'; dimensions: DiningTableDimensions }
  | { category: 'closet'; dimensions: ClosetDimensions; options: ClosetOptions }
  | {
      category: 'estructura'
      dimensions: StructureDimensions
      options: StructureOptions
    }

export interface DesignStateSnapshot {
  category: DesignCategory
  materialId: MaterialId
  desk: DeskDimensions
  dining: DiningTableDimensions
  closet: ClosetDimensions
  closetOptions: ClosetOptions
  structure: StructureDimensions
  structureOptions: StructureOptions
}

export interface CategoryOption {
  id: DesignCategory
  label: string
  description: string
}
