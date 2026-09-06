import { useDesignStore } from '../../store/designStore'
import { FreeformScene } from './FreeformScene'
import { ModelFactory } from './ModelFactory'
import { ModelRoot, TransformGizmo } from './TransformGizmo'

interface EditableModelProps {
  onDraggingChange?: (dragging: boolean) => void
}

export function EditableModel({ onDraggingChange }: EditableModelProps) {
  const category = useDesignStore((state) => state.category)

  return (
    <>
      {category === 'freeform' ? (
        <FreeformScene />
      ) : (
        <ModelRoot>
          <ModelFactory />
        </ModelRoot>
      )}
      <TransformGizmo onDraggingChange={onDraggingChange} />
    </>
  )
}
