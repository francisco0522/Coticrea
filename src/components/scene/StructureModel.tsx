import { useMemo } from 'react'
import { DesignMeshMaterial } from './DesignMeshMaterial'
import { useDesignMaterial } from './useDesignMaterial'
import type {
  MaterialId,
  StructureDimensions,
  StructureOptions,
} from '../../types/design'

interface StructureModelProps {
  dimensions: StructureDimensions
  options: StructureOptions
  materialId: MaterialId
}

export function StructureModel({
  dimensions,
  options,
  materialId,
}: StructureModelProps) {
  const material = useDesignMaterial(materialId)
  const { length: L, width: W, height: H, profileThickness: P } = dimensions
  const beamCount = Math.max(1, Math.round(options.beamCount))
  const spacing = Math.max(0.5, options.pillarSpacing)

  const pillarXs = useMemo(() => {
    const count = Math.max(2, Math.floor(L / spacing) + 1)
    if (count === 2) return [-L / 2, L / 2]
    return Array.from({ length: count }, (_, index) => -L / 2 + (L * index) / (count - 1))
  }, [L, spacing])

  const pillarZs = useMemo(() => [-W / 2, W / 2], [W])

  const beamYs = useMemo(() => {
    if (beamCount === 1) return [H]
    return Array.from({ length: beamCount }, (_, index) => {
      if (index === beamCount - 1) return H
      return ((index + 1) / beamCount) * H
    })
  }, [beamCount, H])

  return (
    <group>
      {pillarXs.map((x) =>
        pillarZs.map((z) => (
          <mesh
            key={`pillar-${x}-${z}`}
            position={[x, H / 2, z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[P, H, P]} />
            <DesignMeshMaterial material={material} metalnessFloor={0.35} />
          </mesh>
        )),
      )}

      {beamYs.map((y, beamIndex) => (
        <group key={`level-${beamIndex}`}>
          {/* Vigas longitudinales */}
          {pillarZs.map((z) => (
            <mesh
              key={`beam-x-${beamIndex}-${z}`}
              position={[0, y - P / 2, z]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[L + P, P, P]} />
              <DesignMeshMaterial material={material} metalnessFloor={0.35} />
            </mesh>
          ))}

          {/* Vigas transversales */}
          {pillarXs.map((x) => (
            <mesh
              key={`beam-z-${beamIndex}-${x}`}
              position={[x, y - P / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[P, P, W + P]} />
              <DesignMeshMaterial material={material} metalnessFloor={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
