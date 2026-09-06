import { useDesignMaterial } from './useDesignMaterial'
import type { DiningTableDimensions, MaterialId } from '../../types/design'

interface DiningModelProps {
  dimensions: DiningTableDimensions
  materialId: MaterialId
}

export function DiningModel({ dimensions, materialId }: DiningModelProps) {
  const material = useDesignMaterial(materialId)
  const { length: L, width: W, height: H, thickness: T } = dimensions

  const legSize = Math.max(0.05, T * 1.5)
  const inset = legSize * 1.1
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

      {/* Apron / faldón bajo el tablero */}
      <mesh position={[0, legHeight - T * 0.6, 0]} castShadow>
        <boxGeometry args={[L * 0.92, T * 0.7, W * 0.92]} />
        <meshStandardMaterial
          color={material.color}
          roughness={Math.min(1, material.roughness + 0.15)}
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
