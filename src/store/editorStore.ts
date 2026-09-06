import { create } from 'zustand'
import {
  MODEL_ROOT_ID,
  cloneTransform,
  createId,
  type EditorTool,
  type ObjectTransform,
  type SceneNode,
  type TransformSpace,
  type Vec3,
} from '../types/editor'

function defaultCube(partial?: Partial<SceneNode>): SceneNode {
  const id = partial?.id ?? createId('cube')
  return {
    id,
    type: 'cube',
    name: partial?.name ?? 'Cubo',
    parentId: partial?.parentId ?? null,
    transform: cloneTransform(partial?.transform),
    size: partial?.size ?? { x: 0.5, y: 0.5, z: 0.5 },
    color: partial?.color ?? '#c4a574',
    childIds: [],
  }
}

interface EditorStore {
  tool: EditorTool
  space: TransformSpace
  selectedIds: string[]
  snapEnabled: boolean
  translateSnap: number
  rotateSnapDeg: number
  scaleSnap: number
  showGrid: boolean
  /** Transforms de piezas paramétricas y root del modelo */
  transforms: Record<string, ObjectTransform>
  /** Nodos freeform (cubos/grupos) */
  sceneNodes: Record<string, SceneNode>
  rootNodeIds: string[]

  setTool: (tool: EditorTool) => void
  setSpace: (space: TransformSpace) => void
  select: (id: string | null, options?: { additive?: boolean }) => void
  clearSelection: () => void
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

  addCube: () => string
  deleteSelected: () => void
  joinSelected: () => string | null
  ungroupSelected: () => void
  renameNode: (id: string, name: string) => void
  setNodeColor: (id: string, color: string) => void
  setNodeSize: (id: string, size: Partial<Vec3>) => void
  getNode: (id: string) => SceneNode | undefined
  getSelectedPrimaryId: () => string | null
}

function withNodeTransform(
  node: SceneNode,
  partial: Partial<ObjectTransform>,
): SceneNode {
  return {
    ...node,
    transform: {
      position: partial.position ?? node.transform.position,
      rotation: partial.rotation ?? node.transform.rotation,
      scale: partial.scale ?? node.transform.scale,
    },
  }
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tool: 'move',
  space: 'world',
  selectedIds: [MODEL_ROOT_ID],
  snapEnabled: true,
  translateSnap: 0.05,
  rotateSnapDeg: 15,
  scaleSnap: 0.05,
  showGrid: true,
  transforms: {
    [MODEL_ROOT_ID]: cloneTransform(),
  },
  sceneNodes: {},
  rootNodeIds: [],

  setTool: (tool) => set({ tool }),
  setSpace: (space) => set({ space }),

  select: (id, options) => {
    if (id === null) {
      set({ selectedIds: [] })
      return
    }
    const additive = options?.additive ?? false
    set((state) => {
      if (!additive) return { selectedIds: [id] }
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((x) => x !== id) }
      }
      return { selectedIds: [...state.selectedIds, id] }
    })
  },

  clearSelection: () => set({ selectedIds: [] }),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  setSnapEnabled: (value) => set({ snapEnabled: value }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  ensureTransform: (id) => {
    const existing = get().transforms[id]
    if (existing) return existing
    const next = cloneTransform()
    set((state) => ({
      transforms: { ...state.transforms, [id]: next },
    }))
    return next
  },

  setPosition: (id, position) => {
    const node = get().sceneNodes[id]
    if (node) {
      set((state) => ({
        sceneNodes: {
          ...state.sceneNodes,
          [id]: withNodeTransform(node, { position }),
        },
      }))
      return
    }
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneTransform()),
          position,
        },
      },
    }))
  },

  setRotation: (id, rotation) => {
    const node = get().sceneNodes[id]
    if (node) {
      set((state) => ({
        sceneNodes: {
          ...state.sceneNodes,
          [id]: withNodeTransform(node, { rotation }),
        },
      }))
      return
    }
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneTransform()),
          rotation,
        },
      },
    }))
  },

  setScale: (id, scale) => {
    const node = get().sceneNodes[id]
    if (node) {
      set((state) => ({
        sceneNodes: {
          ...state.sceneNodes,
          [id]: withNodeTransform(node, { scale }),
        },
      }))
      return
    }
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: {
          ...(state.transforms[id] ?? cloneTransform()),
          scale,
        },
      },
    }))
  },

  setTransform: (id, partial) => {
    const node = get().sceneNodes[id]
    if (node) {
      set((state) => ({
        sceneNodes: {
          ...state.sceneNodes,
          [id]: withNodeTransform(node, partial),
        },
      }))
      return
    }
    set((state) => {
      const current = state.transforms[id] ?? cloneTransform()
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
    })
  },

  resetTransform: (id) => {
    const target = id ?? get().selectedIds[0] ?? MODEL_ROOT_ID
    const node = get().sceneNodes[target]
    if (node) {
      set((state) => ({
        sceneNodes: {
          ...state.sceneNodes,
          [target]: { ...node, transform: cloneTransform() },
        },
      }))
      return
    }
    set((state) => ({
      transforms: {
        ...state.transforms,
        [target]: cloneTransform(),
      },
    }))
  },

  resetEditor: () =>
    set({
      tool: 'move',
      space: 'world',
      selectedIds: [MODEL_ROOT_ID],
      snapEnabled: true,
      showGrid: true,
      transforms: {
        [MODEL_ROOT_ID]: cloneTransform(),
      },
      sceneNodes: {},
      rootNodeIds: [],
    }),

  addCube: () => {
    const count = Object.keys(get().sceneNodes).length
    const offset = (count % 5) * 0.15
    const cube = defaultCube({
      name: `Cubo ${count + 1}`,
      transform: {
        ...cloneTransform(),
        position: { x: offset, y: 0.25, z: offset * 0.5 },
      },
    })
    set((state) => ({
      sceneNodes: { ...state.sceneNodes, [cube.id]: cube },
      rootNodeIds: [...state.rootNodeIds, cube.id],
      selectedIds: [cube.id],
      tool: state.tool === 'select' ? 'move' : state.tool,
    }))
    return cube.id
  },

  deleteSelected: () => {
    const { selectedIds, sceneNodes, rootNodeIds } = get()
    if (selectedIds.length === 0) return

    const toDelete = new Set<string>()
    const visit = (id: string) => {
      if (toDelete.has(id)) return
      toDelete.add(id)
      const node = sceneNodes[id]
      if (!node) return
      node.childIds.forEach(visit)
    }
    selectedIds.forEach((id) => {
      if (sceneNodes[id]) visit(id)
    })

    if (toDelete.size === 0) {
      // selected parametric parts: just clear selection / reset those transforms
      set((state) => {
        const transforms = { ...state.transforms }
        selectedIds.forEach((id) => {
          if (id !== MODEL_ROOT_ID) transforms[id] = cloneTransform()
        })
        return { selectedIds: [], transforms }
      })
      return
    }

    const nextNodes = { ...sceneNodes }
    toDelete.forEach((id) => {
      const node = nextNodes[id]
      if (node?.parentId && nextNodes[node.parentId]) {
        const parent = nextNodes[node.parentId]
        nextNodes[node.parentId] = {
          ...parent,
          childIds: parent.childIds.filter((cid) => cid !== id),
        }
      }
      delete nextNodes[id]
    })

    set({
      sceneNodes: nextNodes,
      rootNodeIds: rootNodeIds.filter((id) => !toDelete.has(id)),
      selectedIds: [],
    })
  },

  joinSelected: () => {
    const { selectedIds, sceneNodes, rootNodeIds } = get()
    const ids = selectedIds.filter((id) => sceneNodes[id] && sceneNodes[id].parentId === null)
    if (ids.length < 2) return null

    // Centroide de posiciones
    const centroid = ids.reduce(
      (acc, id) => {
        const p = sceneNodes[id].transform.position
        return { x: acc.x + p.x, y: acc.y + p.y, z: acc.z + p.z }
      },
      { x: 0, y: 0, z: 0 },
    )
    centroid.x /= ids.length
    centroid.y /= ids.length
    centroid.z /= ids.length

    const groupId = createId('group')
    const group: SceneNode = {
      id: groupId,
      type: 'group',
      name: `Grupo (${ids.length})`,
      parentId: null,
      transform: {
        position: { ...centroid },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      size: { x: 1, y: 1, z: 1 },
      color: '#94a3b8',
      childIds: [...ids],
    }

    const nextNodes = { ...sceneNodes, [groupId]: group }
    ids.forEach((id) => {
      const node = nextNodes[id]
      nextNodes[id] = {
        ...node,
        parentId: groupId,
        transform: {
          ...node.transform,
          position: {
            x: node.transform.position.x - centroid.x,
            y: node.transform.position.y - centroid.y,
            z: node.transform.position.z - centroid.z,
          },
        },
      }
    })

    set({
      sceneNodes: nextNodes,
      rootNodeIds: [...rootNodeIds.filter((id) => !ids.includes(id)), groupId],
      selectedIds: [groupId],
    })
    return groupId
  },

  ungroupSelected: () => {
    const { selectedIds, sceneNodes, rootNodeIds } = get()
    const groupIds = selectedIds.filter((id) => sceneNodes[id]?.type === 'group')
    if (groupIds.length === 0) return

    let nextNodes = { ...sceneNodes }
    let nextRoots = [...rootNodeIds]
    const newSelection: string[] = []

    groupIds.forEach((groupId) => {
      const group = nextNodes[groupId]
      if (!group) return
      const gp = group.transform.position
      group.childIds.forEach((childId) => {
        const child = nextNodes[childId]
        if (!child) return
        nextNodes[childId] = {
          ...child,
          parentId: null,
          transform: {
            ...child.transform,
            position: {
              x: child.transform.position.x + gp.x,
              y: child.transform.position.y + gp.y,
              z: child.transform.position.z + gp.z,
            },
          },
        }
        if (!nextRoots.includes(childId)) nextRoots.push(childId)
        newSelection.push(childId)
      })
      nextRoots = nextRoots.filter((id) => id !== groupId)
      delete nextNodes[groupId]
    })

    set({
      sceneNodes: nextNodes,
      rootNodeIds: nextRoots,
      selectedIds: newSelection,
    })
  },

  renameNode: (id, name) =>
    set((state) => {
      const node = state.sceneNodes[id]
      if (!node) return state
      return {
        sceneNodes: {
          ...state.sceneNodes,
          [id]: { ...node, name },
        },
      }
    }),

  setNodeColor: (id, color) =>
    set((state) => {
      const node = state.sceneNodes[id]
      if (!node) return state
      return {
        sceneNodes: {
          ...state.sceneNodes,
          [id]: { ...node, color },
        },
      }
    }),

  setNodeSize: (id, size) =>
    set((state) => {
      const node = state.sceneNodes[id]
      if (!node || node.type !== 'cube') return state
      return {
        sceneNodes: {
          ...state.sceneNodes,
          [id]: {
            ...node,
            size: {
              x: size.x ?? node.size.x,
              y: size.y ?? node.size.y,
              z: size.z ?? node.size.z,
            },
          },
        },
      }
    }),

  getNode: (id) => get().sceneNodes[id],

  getSelectedPrimaryId: () => get().selectedIds[0] ?? null,
}))
