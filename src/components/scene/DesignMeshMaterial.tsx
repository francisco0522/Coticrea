import type { DesignMaterialProps } from './useDesignMaterial'

interface DesignMeshMaterialProps {
  material: DesignMaterialProps
  roughnessOffset?: number
  metalnessFloor?: number
}

export function DesignMeshMaterial({
  material,
  roughnessOffset = 0,
  metalnessFloor = 0,
}: DesignMeshMaterialProps) {
  return (
    <meshStandardMaterial
      color={material.color}
      roughness={Math.min(1, material.roughness + roughnessOffset)}
      metalness={Math.max(material.metalness, metalnessFloor)}
      transparent={material.transparent}
      opacity={material.opacity}
    />
  )
}
