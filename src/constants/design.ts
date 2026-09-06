import type {
  CategoryOption,
  ClosetDimensions,
  ClosetOptions,
  DeskDimensions,
  DiningTableDimensions,
  MaterialOption,
  StructureDimensions,
  StructureOptions,
} from '../types/design'

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'escritorio',
    label: 'Escritorio',
    description: 'Superficie de trabajo con patas paramétricas',
  },
  {
    id: 'closet',
    label: 'Closet',
    description: 'Armario con estantes y divisiones verticales',
  },
  {
    id: 'comedor',
    label: 'Comedor',
    description: 'Mesa de comedor con tablero y patas',
  },
  {
    id: 'estructura',
    label: 'Estructura',
    description: 'Estructura paramétrica de vigas y pilares',
  },
  {
    id: 'freeform',
    label: 'Freeform',
    description: 'Crea cubos desde cero, edítalos y únelos en grupos',
  },
]

export const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: 'roble',
    label: 'Roble',
    finish: 'natural',
    color: '#b08968',
    category: 'madera',
  },
  {
    id: 'pino',
    label: 'Pino',
    finish: 'mate',
    color: '#e6c89a',
    category: 'madera',
  },
  {
    id: 'nogal',
    label: 'Nogal',
    finish: 'lacado',
    color: '#6f4e37',
    category: 'madera',
  },
  {
    id: 'mdf',
    label: 'MDF',
    finish: 'mate',
    color: '#d4c5a9',
    category: 'madera',
  },
  {
    id: 'metal',
    label: 'Metal',
    finish: 'brillante',
    color: '#8a939e',
    category: 'metal',
  },
  {
    id: 'vidrio',
    label: 'Vidrio',
    finish: 'brillante',
    color: '#a8d5e5',
    category: 'vidrio',
  },
]

export const DEFAULT_DESK: DeskDimensions = {
  length: 1.4,
  width: 0.7,
  height: 0.75,
  thickness: 0.03,
}

export const DEFAULT_DINING: DiningTableDimensions = {
  length: 1.8,
  width: 0.9,
  height: 0.75,
  thickness: 0.04,
}

export const DEFAULT_CLOSET: ClosetDimensions = {
  length: 1.6,
  height: 2.2,
  depth: 0.6,
  thickness: 0.018,
}

export const DEFAULT_CLOSET_OPTIONS: ClosetOptions = {
  shelves: 3,
  verticalDivisions: 2,
}

export const DEFAULT_STRUCTURE: StructureDimensions = {
  length: 4,
  height: 2.5,
  width: 3,
  profileThickness: 0.1,
}

export const DEFAULT_STRUCTURE_OPTIONS: StructureOptions = {
  beamCount: 4,
  pillarSpacing: 1.5,
}
