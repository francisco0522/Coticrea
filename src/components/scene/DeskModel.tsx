import { useDesignMaterial } from './useDesignMaterial'
import type { DeskDimensions, MaterialId } from '../../types/design'

interface DeskModelProps {
  dimensions: DeskDimensions
  materialId: MaterialId
}

export function DeskModel({ dimensions, materialId }: DeskModelProps) {
  const material = useDesignMaterial(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions

  const legSize = Math.max(0.04, T * 1.4)
  const inset = legSize * 0.8
  const legHeight = Math.max(0.05, H - T)
  const topY = legHeight + T / 2
  const legY = legHeight / 2

  const legPositions: Array<[number, number, number]> = [
    [-L / 2 + inset, legY, -W / 2 + inset],
    [L / 2 - inset, legY, -W / 2 + inset],
    [-L / 2 + inset, legY, W / 2 - inset],
    [L / 2 - inset, legY, W / 2 - inset],
  ]

  return (
    <group>
      <mesh position={[0, topY, 0]} castShadow receiveShadow>
        <boxGeometry args={[L, T, W]} />
        <meshStandardMaterial
          color={material.color}
          roughness={material.roughness}
          metalness={material.metalness}
          transparent={material.transparent}
          opacity={material.opacity}
        />
      </mesh>

      {legPositions.map((position, index) => (
        <mesh key={index} position={position} castShadow receiveShadow>
          <boxGeometry args={[legSize, legHeight, legSize]} />
          <meshStandardMaterial
            color={material.color}
            roughness={Math.min(1, material.roughness + 0.1)}
            metalness={material.metalness}
            transparent={material.transparent}
            opacity={material.opacity}
          />
        </mesh>
      ))}
    </group>
  )
}
