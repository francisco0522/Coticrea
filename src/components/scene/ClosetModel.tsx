import { useMemo } from 'react'
import { DesignMeshMaterial } from './DesignMeshMaterial'
import { useDesignMaterial } from './useDesignMaterial'
import type {
  ClosetDimensions,
  ClosetOptions,
  MaterialId,
} from '../../types/design'

interface ClosetModelProps {
  dimensions: ClosetDimensions
  options: ClosetOptions
  materialId: MaterialId
}

export function ClosetModel({
  dimensions,
  options,
  materialId,
}: ClosetModelProps) {
  const material = useDesignMaterial(materialId)
  const { length: L, height: H, depth: D, thickness: T } = dimensions
  const shelves = Math.max(0, Math.round(options.shelves))
  const divisions = Math.max(0, Math.round(options.verticalDivisions))

  const innerWidth = Math.max(T, L - 2 * T)
  const innerHeight = Math.max(T, H - 2 * T)
  const shelfDepth = Math.max(T, D - T)

  const shelfYs = useMemo(() => {
    if (shelves <= 0) return [] as number[]
    const start = T + innerHeight / (shelves + 1)
    return Array.from({ length: shelves }, (_, index) => start + index * (innerHeight / (shelves + 1)))
  }, [innerHeight, shelves, T])

  const dividerXs = useMemo(() => {
    if (divisions <= 0) return [] as number[]
    return Array.from({ length: divisions }, (_, index) => {
      const step = innerWidth / (divisions + 1)
      return -innerWidth / 2 + step * (index + 1)
    })
  }, [divisions, innerWidth])

  return (
    <group position={[0, H / 2, 0]}>
      {/* Laterales */}
      <mesh position={[-L / 2 + T / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <DesignMeshMaterial material={material} />
      </mesh>
      <mesh position={[L / 2 - T / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <DesignMeshMaterial material={material} />
      </mesh>

      {/* Techo y base */}
      <mesh position={[0, H / 2 - T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[L, T, D]} />
        <DesignMeshMaterial material={material} />
      </mesh>
      <mesh position={[0, -H / 2 + T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[L, T, D]} />
        <DesignMeshMaterial material={material} />
      </mesh>

      {/* Fondo */}
      <mesh position={[0, 0, -D / 2 + T / 2]} castShadow receiveShadow>
        <boxGeometry args={[innerWidth, innerHeight, T]} />
        <DesignMeshMaterial material={material} />
      </mesh>

      {/* Estantes */}
      {shelfYs.map((y, index) => (
        <mesh
          key={`shelf-${index}`}
          position={[0, -H / 2 + y, T / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[innerWidth, T, shelfDepth]} />
          <DesignMeshMaterial material={material} />
        </mesh>
      ))}

      {/* Divisiones verticales */}
      {dividerXs.map((x, index) => (
        <mesh
          key={`div-${index}`}
          position={[x, 0, T / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[T, innerHeight, shelfDepth]} />
          <DesignMeshMaterial material={material} />
        </mesh>
      ))}
    </group>
  )
}
