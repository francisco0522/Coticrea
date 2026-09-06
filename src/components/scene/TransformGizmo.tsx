import { TransformControls } from '@react-three/drei'
import { useEffect, useState, type ReactNode } from 'react'
import type { Group, Object3D } from 'three'
import { useEditorStore } from '../../store/editorStore'
import { DEFAULT_TRANSFORM, MODEL_ROOT_ID } from '../../types/editor'
import { useObjectRegistry } from './objectRegistry'

interface TransformGizmoProps {
  onDraggingChange?: (dragging: boolean) => void
}

export function TransformGizmo({ onDraggingChange }: TransformGizmoProps) {
  const tool = useEditorStore((s) => s.tool)
  const space = useEditorStore((s) => s.space)
  const primaryId = useEditorStore((s) => s.selectedIds[0] ?? null)
  const snapEnabled = useEditorStore((s) => s.snapEnabled)
  const translateSnap = useEditorStore((s) => s.translateSnap)
  const rotateSnapDeg = useEditorStore((s) => s.rotateSnapDeg)
  const scaleSnap = useEditorStore((s) => s.scaleSnap)
  const setTransform = useEditorStore((s) => s.setTransform)
  const object = useObjectRegistry((s) =>
    primaryId ? s.objects[primaryId] : undefined,
  ) as Object3D | undefined

  if (!object || !primaryId || tool === 'select') return null

  const mode =
    tool === 'rotate' ? 'rotate' : tool === 'scale' ? 'scale' : 'translate'

  return (
    <TransformControls
      object={object}
      mode={mode}
      space={space}
      translationSnap={snapEnabled ? translateSnap : null}
      rotationSnap={snapEnabled ? (rotateSnapDeg * Math.PI) / 180 : null}
      scaleSnap={snapEnabled ? scaleSnap : null}
      onMouseDown={() => onDraggingChange?.(true)}
      onMouseUp={() => {
        onDraggingChange?.(false)
        setTransform(primaryId, {
          position: {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
          },
          rotation: {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z,
          },
          scale: {
            x: object.scale.x,
            y: object.scale.y,
            z: object.scale.z,
          },
        })
      }}
    />
  )
}

export function ModelRoot({ children }: { children: ReactNode }) {
  const [group, setGroup] = useState<Group | null>(null)
  const transform = useEditorStore(
    (s) => s.transforms[MODEL_ROOT_ID] ?? DEFAULT_TRANSFORM,
  )
  const register = useObjectRegistry((s) => s.register)
  const unregister = useObjectRegistry((s) => s.unregister)
  const select = useEditorStore((s) => s.select)

  useEffect(() => {
    if (!group) return
    register(MODEL_ROOT_ID, group, 'Modelo completo')
    return () => unregister(MODEL_ROOT_ID)
  }, [group, register, unregister])

  useEffect(() => {
    if (!group) return
    group.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z,
    )
    group.rotation.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
    )
    group.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
  }, [group, transform])

  return (
    <group
      ref={setGroup}
      onContextMenu={(event) => {
        event.stopPropagation()
        select(MODEL_ROOT_ID)
      }}
    >
      {children}
    </group>
  )
}
