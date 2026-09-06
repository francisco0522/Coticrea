import { create } from 'zustand'
import {
  DEFAULT_CLOSET,
  DEFAULT_CLOSET_OPTIONS,
  DEFAULT_DESK,
  DEFAULT_DINING,
  DEFAULT_STRUCTURE,
  DEFAULT_STRUCTURE_OPTIONS,
} from '../constants/design'
import type {
  ClosetDimensions,
  ClosetOptions,
  DesignCategory,
  DeskDimensions,
  DiningTableDimensions,
  MaterialId,
  StructureDimensions,
  StructureOptions,
} from '../types/design'

interface DesignStore {
  category: DesignCategory
  materialId: MaterialId
  desk: DeskDimensions
  dining: DiningTableDimensions
  closet: ClosetDimensions
  closetOptions: ClosetOptions
  structure: StructureDimensions
  structureOptions: StructureOptions

  setCategory: (category: DesignCategory) => void
  setMaterialId: (materialId: MaterialId) => void
  updateDesk: (partial: Partial<DeskDimensions>) => void
  updateDining: (partial: Partial<DiningTableDimensions>) => void
  updateCloset: (partial: Partial<ClosetDimensions>) => void
  updateClosetOptions: (partial: Partial<ClosetOptions>) => void
  updateStructure: (partial: Partial<StructureDimensions>) => void
  updateStructureOptions: (partial: Partial<StructureOptions>) => void
  resetCurrentCategory: () => void
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  category: 'escritorio',
  materialId: 'roble',
  desk: { ...DEFAULT_DESK },
  dining: { ...DEFAULT_DINING },
  closet: { ...DEFAULT_CLOSET },
  closetOptions: { ...DEFAULT_CLOSET_OPTIONS },
  structure: { ...DEFAULT_STRUCTURE },
  structureOptions: { ...DEFAULT_STRUCTURE_OPTIONS },

  setCategory: (category) => set({ category }),

  setMaterialId: (materialId) => set({ materialId }),

  updateDesk: (partial) =>
    set((state) => ({ desk: { ...state.desk, ...partial } })),

  updateDining: (partial) =>
    set((state) => ({ dining: { ...state.dining, ...partial } })),

  updateCloset: (partial) =>
    set((state) => ({ closet: { ...state.closet, ...partial } })),

  updateClosetOptions: (partial) =>
    set((state) => ({
      closetOptions: { ...state.closetOptions, ...partial },
    })),

  updateStructure: (partial) =>
    set((state) => ({ structure: { ...state.structure, ...partial } })),

  updateStructureOptions: (partial) =>
    set((state) => ({
      structureOptions: { ...state.structureOptions, ...partial },
    })),

  resetCurrentCategory: () => {
    const { category } = get()
    switch (category) {
      case 'escritorio':
        set({ desk: { ...DEFAULT_DESK } })
        break
      case 'comedor':
        set({ dining: { ...DEFAULT_DINING } })
        break
      case 'closet':
        set({
          closet: { ...DEFAULT_CLOSET },
          closetOptions: { ...DEFAULT_CLOSET_OPTIONS },
        })
        break
      case 'estructura':
        set({
          structure: { ...DEFAULT_STRUCTURE },
          structureOptions: { ...DEFAULT_STRUCTURE_OPTIONS },
        })
        break
      case 'freeform':
        break
    }
  },
}))
