import { TransformControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import type { Group } from 'three'
import { useEditorStore } from '../../store/editorStore'
import { MODEL_OBJECT_ID } from '../../types/editor'
import { ModelFactory } from './ModelFactory'

interface EditableModelProps {
  onDraggingChange?: (dragging: boolean) => void
}

export function EditableModel({ onDraggingChange }: EditableModelProps) {
  const [group, setGroup] = useState<Group | null>(null)
  const tool = useEditorStore((state) => state.tool)
  const space = useEditorStore((state) => state.space)
  const selectedId = useEditorStore((state) => state.selectedId)
  const snapEnabled = useEditorStore((state) => state.snapEnabled)
  const translateSnap = useEditorStore((state) => state.translateSnap)
  const rotateSnapDeg = useEditorStore((state) => state.rotateSnapDeg)
  const scaleSnap = useEditorStore((state) => state.scaleSnap)
  const transform = useEditorStore((state) => state.transforms[MODEL_OBJECT_ID])
  const select = useEditorStore((state) => state.select)
  const setTransform = useEditorStore((state) => state.setTransform)

  const selected = selectedId === MODEL_OBJECT_ID
  const showGizmo = Boolean(group && selected && tool !== 'select')

  useEffect(() => {
    if (!group || !transform) return
    group.position.set(transform.position.x, transform.position.y, transform.position.z)
    group.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z)
    group.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
  }, [group, transform])

  const mode =
    tool === 'rotate' ? 'rotate' : tool === 'scale' ? 'scale' : 'translate'

  return (
    <>
      <group
        ref={setGroup}
        onClick={(event) => {
          event.stopPropagation()
          select(MODEL_OBJECT_ID)
        }}
      >
        <ModelFactory />
      </group>

      {showGizmo && group ? (
        <TransformControls
          object={group}
          mode={mode}
          space={space}
          translationSnap={snapEnabled ? translateSnap : null}
          rotationSnap={snapEnabled ? (rotateSnapDeg * Math.PI) / 180 : null}
          scaleSnap={snapEnabled ? scaleSnap : null}
          onMouseDown={() => {
            onDraggingChange?.(true)
          }}
          onMouseUp={() => {
            onDraggingChange?.(false)
            setTransform(MODEL_OBJECT_ID, {
              position: {
                x: group.position.x,
                y: group.position.y,
                z: group.position.z,
              },
              rotation: {
                x: group.rotation.x,
                y: group.rotation.y,
                z: group.rotation.z,
              },
              scale: {
                x: group.scale.x,
                y: group.scale.y,
                z: group.scale.z,
              },
            })
          }}
        />
      ) : null}
    </>
  )
}
