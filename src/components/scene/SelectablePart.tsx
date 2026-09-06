import { useEffect, useState, type ReactNode } from 'react'
import type { Group, Mesh } from 'three'
import { useEditorStore } from '../../store/editorStore'
import { DEFAULT_TRANSFORM } from '../../types/editor'
import type { MaterialId } from '../../types/design'
import { DesignMeshMaterial } from './DesignMeshMaterial'
import { useDesignMaterial } from './useDesignMaterial'
import { useObjectRegistry } from './objectRegistry'

interface SelectablePartProps {
  partId: string
  label?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  children: ReactNode
}

/**
 * Pieza seleccionable:
 * - grupo base = pose paramétrica fija
 * - grupo offset = transform editable (gizmo / inspector)
 */
export function SelectablePart({
  partId,
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  children,
}: SelectablePartProps) {
  const [offsetGroup, setOffsetGroup] = useState<Group | null>(null)
  const selected = useEditorStore((state) => state.selectedIds.includes(partId))
  const select = useEditorStore((state) => state.select)
  // Important: never return a fresh object from the selector (causes max update depth).
  const offset = useEditorStore(
    (state) => state.transforms[partId] ?? DEFAULT_TRANSFORM,
  )
  const registerObject = useObjectRegistry((s) => s.register)
  const unregisterObject = useObjectRegistry((s) => s.unregister)

  useEffect(() => {
    if (!offsetGroup) return
    registerObject(partId, offsetGroup, label ?? partId)
    return () => unregisterObject(partId)
  }, [offsetGroup, partId, label, registerObject, unregisterObject])

  useEffect(() => {
    if (!offsetGroup) return
    offsetGroup.position.set(
      offset.position.x,
      offset.position.y,
      offset.position.z,
    )
    offsetGroup.rotation.set(
      offset.rotation.x,
      offset.rotation.y,
      offset.rotation.z,
    )
    offsetGroup.scale.set(offset.scale.x, offset.scale.y, offset.scale.z)
  }, [offsetGroup, offset])

  useEffect(() => {
    if (!offsetGroup) return
    offsetGroup.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((mat) => {
        if (mat && 'emissive' in mat && mat.emissive) {
          const m = mat as {
            emissive: { set: (c: string) => void }
            emissiveIntensity?: number
          }
          m.emissive.set(selected ? '#f59e0b' : '#000000')
          if (typeof m.emissiveIntensity === 'number') {
            m.emissiveIntensity = selected ? 0.35 : 0
          }
        }
      })
    })
  }, [offsetGroup, selected])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group
        ref={setOffsetGroup}
        userData={{ partId, label }}
        onClick={(event) => {
          event.stopPropagation()
          select(partId, { additive: event.nativeEvent.shiftKey })
        }}
      >
        {children}
      </group>
    </group>
  )
}

export function PartMesh({
  partId,
  label,
  position,
  args,
  materialId,
  roughnessOffset = 0,
}: {
  partId: string
  label: string
  position: [number, number, number]
  args: [number, number, number]
  materialId: MaterialId
  roughnessOffset?: number
}) {
  const material = useDesignMaterial(materialId)
  return (
    <SelectablePart partId={partId} label={label} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <DesignMeshMaterial
          material={material}
          roughnessOffset={roughnessOffset}
        />
      </mesh>
    </SelectablePart>
  )
}
