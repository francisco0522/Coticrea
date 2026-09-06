import { useMemo } from 'react'
import { MATERIAL_OPTIONS } from '../../constants/design'
import type { MaterialId } from '../../types/design'

export interface DesignMaterialProps {
  color: string
  roughness: number
  metalness: number
  transparent: boolean
  opacity: number
  label: string
}

export function resolveDesignMaterial(materialId: MaterialId): DesignMaterialProps {
  const option = MATERIAL_OPTIONS.find((item) => item.id === materialId)

  if (!option) {
    return {
      color: '#b08968',
      roughness: 0.7,
      metalness: 0.05,
      transparent: false,
      opacity: 1,
      label: materialId,
    }
  }

  switch (option.category) {
    case 'metal':
      return {
        color: option.color,
        roughness: option.finish === 'brillante' ? 0.25 : 0.45,
        metalness: 0.9,
        transparent: false,
        opacity: 1,
        label: option.label,
      }
    case 'vidrio':
      return {
        color: option.color,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        label: option.label,
      }
    default: {
      const roughness =
        option.finish === 'brillante' || option.finish === 'lacado' ? 0.35 : 0.75
      return {
        color: option.color,
        roughness,
        metalness: 0.05,
        transparent: false,
        opacity: 1,
        label: option.label,
      }
    }
  }
}

export function useDesignMaterial(materialId: MaterialId): DesignMaterialProps {
  return useMemo(() => resolveDesignMaterial(materialId), [materialId])
}
