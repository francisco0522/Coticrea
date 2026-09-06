export type EditorTool = 'select' | 'move' | 'rotate' | 'scale'

export type TransformSpace = 'world' | 'local'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface ObjectTransform {
  position: Vec3
  rotation: Vec3
  scale: Vec3
}

export const DEFAULT_TRANSFORM: ObjectTransform = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
}

export const MODEL_ROOT_ID = 'model-root' as const

/** @deprecated use MODEL_ROOT_ID */
export const MODEL_OBJECT_ID = MODEL_ROOT_ID

export type SceneNodeType = 'cube' | 'group'

export interface SceneNode {
  id: string
  type: SceneNodeType
  name: string
  parentId: string | null
  transform: ObjectTransform
  /** Solo cubos */
  size: Vec3
  color: string
  /** Hijos directos (grupos y jerarquía freeform) */
  childIds: string[]
}

export function cloneTransform(t: ObjectTransform = DEFAULT_TRANSFORM): ObjectTransform {
  return {
    position: { ...t.position },
    rotation: { ...t.rotation },
    scale: { ...t.scale },
  }
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
