import { create } from 'zustand'
import {
  DEFAULT_TRANSFORM,
  MODEL_OBJECT_ID,
  type EditorTool,
  type ObjectTransform,
  type TransformSpace,
  type Vec3,
} from '../types/editor'

interface EditorStore {
  tool: EditorTool
  space: TransformSpace
  selectedId: string | null
  snapEnabled: boolean
  translateSnap: number
  rotateSnapDeg: number
  scaleSnap: number
  showGrid: boolean
  transforms: Record<string, ObjectTransform>

  setTool: (tool: EditorTool) => void
  setSpace: (space: TransformSpace) => void
  select: (id: string | null) => void
  toggleSnap: () => void
  setSnapEnabled: (value: boolean) => void
  toggleGrid: () => void
  ensureTransform: (id: string) => ObjectTransform
  setPosition: (id: string, position: Vec3) => void
  setRotation: (id: string, rotation: Vec3) => void
  setScale: (id: string, scale: Vec3) => void
  setTransform: (id: string, transform: Partial<ObjectTransform>) => void
  resetTransform: (id?: string) => void
  resetEditor: () => void
}

function cloneDefault(): ObjectTransform {
  return {
    position: { ...DEFAULT_TRANSFORM.position },
    rotation: { ...DEFAULT_TRANSFORM.rotation },
    scale: { ...DEFAULT_TRANSFORM.scale },
  }
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tool: 'move',
  space: 'world',
  selectedId: MODEL_OBJECT_ID,
  snapEnabled: true,
  translateSnap: 0.05,
  rotateSnapDeg: 15,
  scaleSnap: 0.05,
  showGrid: true,
  transforms: {
    [MODEL_OBJECT_ID]: cloneDefault(),
  },

  setTool: (tool) => set({ tool }),
  setSpace: (space) => set({ space }),
  select: (id) => set({ selectedId: id }),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  setSnapEnabled: (value) => set({ snapEnabled: value }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  ensureTransform: (id) => {
    const existing = get().transforms[id]
    if (existing) return existing
    const next = cloneDefault()
    set((state) => ({
      transforms: { ...state.transforms, [id]: next },
    }))
    return next
  },

  setPosition: (id, position) =>
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneDefault()),
          position,
        },
      },
    })),

  setRotation: (id, rotation) =>
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneDefault()),
          rotation,
        },
      },
    })),

  setScale: (id, scale) =>
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneDefault()),
          scale,
        },
      },
    })),

  setTransform: (id, partial) =>
    set((state) => {
      const current = state.transforms[id] ?? cloneDefault()
      return {
        transforms: {
          ...state.transforms,
          [id]: {
            position: partial.position ?? current.position,
            rotation: partial.rotation ?? current.rotation,
            scale: partial.scale ?? current.scale,
          },
        },
      }
    }),

  resetTransform: (id = MODEL_OBJECT_ID) =>
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: cloneDefault(),
      },
    })),

  resetEditor: () =>
    set({
      tool: 'move',
      space: 'world',
      selectedId: MODEL_OBJECT_ID,
      snapEnabled: true,
      showGrid: true,
      transforms: {
        [MODEL_OBJECT_ID]: cloneDefault(),
      },
    }),
}))
