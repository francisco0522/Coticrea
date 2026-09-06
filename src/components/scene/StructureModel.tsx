import { useMemo } from 'react'
import type {
  MaterialId,
  StructureDimensions,
  StructureOptions,
} from '../../types/design'
import { PartMesh } from './SelectablePart'

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
  const { length: L, width: W, height: H, profileThickness: P } = dimensions
  const beamCount = Math.max(1, Math.round(options.beamCount))
  const spacing = Math.max(0.5, options.pillarSpacing)

  const pillarXs = useMemo(() => {
    const count = Math.max(2, Math.floor(L / spacing) + 1)
    if (count === 2) return [-L / 2, L / 2]
    return Array.from(
      { length: count },
      (_, index) => -L / 2 + (L * index) / (count - 1),
    )
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
      {pillarXs.map((x, xi) =>
        pillarZs.map((z, zi) => (
          <PartMesh
            key={`pillar-${xi}-${zi}`}
            partId={`struct-pillar-${xi}-${zi}`}
            label={`Pilar ${xi + 1}-${zi + 1}`}
            position={[x, H / 2, z]}
            args={[P, H, P]}
            materialId={materialId}
          />
        )),
      )}

      {beamYs.map((y, beamIndex) => (
        <group key={`level-${beamIndex}`}>
          {pillarZs.map((z, zi) => (
            <PartMesh
              key={`beam-x-${beamIndex}-${zi}`}
              partId={`struct-beam-x-${beamIndex}-${zi}`}
              label={`Viga L${beamIndex + 1}-${zi + 1}`}
              position={[0, y - P / 2, z]}
              args={[L + P, P, P]}
              materialId={materialId}
            />
          ))}
          {pillarXs.map((x, xi) => (
            <PartMesh
              key={`beam-z-${beamIndex}-${xi}`}
              partId={`struct-beam-z-${beamIndex}-${xi}`}
              label={`Viga T${beamIndex + 1}-${xi + 1}`}
              position={[x, y - P / 2, 0]}
              args={[P, P, W + P]}
              materialId={materialId}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
