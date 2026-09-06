import { useEffect, useState } from 'react'
import type { Group, Mesh } from 'three'
import { useEditorStore } from '../../store/editorStore'
import type { SceneNode } from '../../types/editor'
import { useObjectRegistry } from './objectRegistry'

function FreeformNodeView({ nodeId }: { nodeId: string }) {
  const node = useEditorStore((s) => s.sceneNodes[nodeId])
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const select = useEditorStore((s) => s.select)
  const [group, setGroup] = useState<Group | null>(null)
  const register = useObjectRegistry((s) => s.register)
  const unregister = useObjectRegistry((s) => s.unregister)

  useEffect(() => {
    if (!group || !node) return
    register(node.id, group, node.name)
    return () => unregister(node.id)
  }, [group, node, register, unregister])

  useEffect(() => {
    if (!group || !node) return
    const t = node.transform
    group.position.set(t.position.x, t.position.y, t.position.z)
    group.rotation.set(t.rotation.x, t.rotation.y, t.rotation.z)
    group.scale.set(t.scale.x, t.scale.y, t.scale.z)
  }, [group, node])

  useEffect(() => {
    if (!group || !node) return
    const selected = selectedIds.includes(node.id)
    group.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((mat) => {
        if (mat && 'emissive' in mat && mat.emissive) {
          const m = mat as { emissive: { set: (c: string) => void }; emissiveIntensity?: number }
          m.emissive.set(selected ? '#f59e0b' : '#000000')
          if (typeof m.emissiveIntensity === 'number') {
            m.emissiveIntensity = selected ? 0.35 : 0
          }
        }
      })
    })
  }, [group, node, selectedIds])

  if (!node) return null

  return (
    <group
      ref={setGroup}
      userData={{ partId: node.id, label: node.name }}
      onClick={(event) => {
        event.stopPropagation()
        select(node.id, { additive: event.nativeEvent.shiftKey })
      }}
    >
      {node.type === 'cube' ? (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[node.size.x, node.size.y, node.size.z]} />
          <meshStandardMaterial color={node.color} roughness={0.55} metalness={0.05} />
        </mesh>
      ) : null}

      {node.type === 'group'
        ? node.childIds.map((childId) => (
            <FreeformNodeView key={childId} nodeId={childId} />
          ))
        : null}
    </group>
  )
}

export function FreeformScene() {
  const rootNodeIds = useEditorStore((s) => s.rootNodeIds)
  const addCube = useEditorStore((s) => s.addCube)

  // Auto seed first cube if empty when entering freeform
  useEffect(() => {
    if (rootNodeIds.length === 0) {
      addCube()
    }
    // only on mount / when emptied
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <group>
      {rootNodeIds.map((id) => (
        <FreeformNodeView key={id} nodeId={id} />
      ))}
    </group>
  )
}

export type { SceneNode }
