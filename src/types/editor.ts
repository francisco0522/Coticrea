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

export const MODEL_OBJECT_ID = 'active-model' as const
