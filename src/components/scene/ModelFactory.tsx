import { useDesignStore } from '../../store/designStore'
import { ClosetModel } from './ClosetModel'
import { DeskModel } from './DeskModel'
import { DiningModel } from './DiningModel'
import { StructureModel } from './StructureModel'

/**
 * Factory de modelos 3D: elige el componente según la categoría activa del store.
 */
export function ModelFactory() {
  const category = useDesignStore((state) => state.category)
  const materialId = useDesignStore((state) => state.materialId)
  const desk = useDesignStore((state) => state.desk)
  const dining = useDesignStore((state) => state.dining)
  const closet = useDesignStore((state) => state.closet)
  const closetOptions = useDesignStore((state) => state.closetOptions)
  const structure = useDesignStore((state) => state.structure)
  const structureOptions = useDesignStore((state) => state.structureOptions)

  switch (category) {
    case 'escritorio':
      return <DeskModel dimensions={desk} materialId={materialId} />
    case 'comedor':
      return <DiningModel dimensions={dining} materialId={materialId} />
    case 'closet':
      return (
        <ClosetModel
          dimensions={closet}
          options={closetOptions}
          materialId={materialId}
        />
      )
    case 'estructura':
      return (
        <StructureModel
          dimensions={structure}
          options={structureOptions}
          materialId={materialId}
        />
      )
    case 'freeform':
      return null
    default: {
      const _exhaustive: never = category
      return _exhaustive
    }
  }
}
