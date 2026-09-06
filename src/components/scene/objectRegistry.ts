import { create } from 'zustand'
import type { Object3D } from 'three'

interface RegistryState {
  objects: Record<string, Object3D>
  labels: Record<string, string>
  register: (id: string, object: Object3D, label?: string) => void
  unregister: (id: string) => void
  get: (id: string) => Object3D | undefined
}

export const useObjectRegistry = create<RegistryState>((set, get) => ({
  objects: {},
  labels: {},
  register: (id, object, label) => {
    const state = get()
    if (state.objects[id] === object && (!label || state.labels[id] === label)) {
      return
    }
    set({
      objects: { ...state.objects, [id]: object },
      labels: {
        ...state.labels,
        [id]: label ?? state.labels[id] ?? id,
      },
    })
  },
  unregister: (id) => {
    const state = get()
    if (!(id in state.objects) && !(id in state.labels)) return
    const objects = { ...state.objects }
    const labels = { ...state.labels }
    delete objects[id]
    delete labels[id]
    set({ objects, labels })
  },
  get: (id) => get().objects[id],
}))
