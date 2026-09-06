import type { DiningTableDimensions, MaterialId } from '../../types/design'
import { PartMesh } from './SelectablePart'

interface DiningModelProps {
  dimensions: DiningTableDimensions
  materialId: MaterialId
}

export function DiningModel({ dimensions, materialId }: DiningModelProps) {
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
      <PartMesh
        partId="dining-top"
        label="Tablero"
        position={[0, topY, 0]}
        args={[L, T, W]}
        materialId={materialId}
      />
      <PartMesh
        partId="dining-apron"
        label="Faldón"
        position={[0, legHeight - T * 0.6, 0]}
        args={[L * 0.92, T * 0.7, W * 0.92]}
        materialId={materialId}
        roughnessOffset={0.15}
      />
      {legPositions.map((position, index) => (
        <PartMesh
          key={index}
          partId={`dining-leg-${index}`}
          label={`Pata ${index + 1}`}
          position={position}
          args={[legSize, legHeight, legSize]}
          materialId={materialId}
          roughnessOffset={0.1}
        />
      ))}
    </group>
  )
}
