import type { DeskDimensions, MaterialId } from '../../types/design'
import { PartMesh } from './SelectablePart'

interface DeskModelProps {
  dimensions: DeskDimensions
  materialId: MaterialId
}

export function DeskModel({ dimensions, materialId }: DeskModelProps) {
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
      <PartMesh
        partId="desk-top"
        label="Tablero"
        position={[0, topY, 0]}
        args={[L, T, W]}
        materialId={materialId}
      />
      {legPositions.map((position, index) => (
        <PartMesh
          key={index}
          partId={`desk-leg-${index}`}
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
