import { useMemo } from 'react'
import type {
  ClosetDimensions,
  ClosetOptions,
  MaterialId,
} from '../../types/design'
import { PartMesh } from './SelectablePart'

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
  const { length: L, height: H, depth: D, thickness: T } = dimensions
  const shelves = Math.max(0, Math.round(options.shelves))
  const divisions = Math.max(0, Math.round(options.verticalDivisions))

  const innerWidth = Math.max(T, L - 2 * T)
  const innerHeight = Math.max(T, H - 2 * T)
  const shelfDepth = Math.max(T, D - T)

  const shelfYs = useMemo(() => {
    if (shelves <= 0) return [] as number[]
    const start = T + innerHeight / (shelves + 1)
    return Array.from(
      { length: shelves },
      (_, index) => start + index * (innerHeight / (shelves + 1)),
    )
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
      <PartMesh
        partId="closet-side-l"
        label="Lateral izq."
        position={[-L / 2 + T / 2, 0, 0]}
        args={[T, H, D]}
        materialId={materialId}
      />
      <PartMesh
        partId="closet-side-r"
        label="Lateral der."
        position={[L / 2 - T / 2, 0, 0]}
        args={[T, H, D]}
        materialId={materialId}
      />
      <PartMesh
        partId="closet-top"
        label="Techo"
        position={[0, H / 2 - T / 2, 0]}
        args={[L, T, D]}
        materialId={materialId}
      />
      <PartMesh
        partId="closet-bottom"
        label="Base"
        position={[0, -H / 2 + T / 2, 0]}
        args={[L, T, D]}
        materialId={materialId}
      />
      <PartMesh
        partId="closet-back"
        label="Fondo"
        position={[0, 0, -D / 2 + T / 2]}
        args={[innerWidth, innerHeight, T]}
        materialId={materialId}
      />
      {shelfYs.map((y, index) => (
        <PartMesh
          key={`shelf-${index}`}
          partId={`closet-shelf-${index}`}
          label={`Estante ${index + 1}`}
          position={[0, -H / 2 + y, T / 2]}
          args={[innerWidth, T, shelfDepth]}
          materialId={materialId}
        />
      ))}
      {dividerXs.map((x, index) => (
        <PartMesh
          key={`div-${index}`}
          partId={`closet-div-${index}`}
          label={`División ${index + 1}`}
          position={[x, 0, T / 2]}
          args={[T, innerHeight, shelfDepth]}
          materialId={materialId}
        />
      ))}
    </group>
  )
}
