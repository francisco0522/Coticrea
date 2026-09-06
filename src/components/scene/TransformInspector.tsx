import { useDesignStore } from '../../store/designStore'
import { useEditorStore } from '../../store/editorStore'
import { useObjectRegistry } from './objectRegistry'

function Field({
  label,
  value,
  step,
  onChange,
}: {
  label: string
  value: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
      <span className="w-3 font-semibold text-slate-500">{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? Number(value.toFixed(3)) : 0}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isNaN(next)) onChange(next)
        }}
        className="w-full rounded border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-200 outline-none focus:border-amber-500"
      />
    </label>
  )
}

export function TransformInspector() {
  const category = useDesignStore((s) => s.category)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const sceneNodes = useEditorStore((s) => s.sceneNodes)
  const transforms = useEditorStore((s) => s.transforms)
  const setPosition = useEditorStore((s) => s.setPosition)
  const setRotation = useEditorStore((s) => s.setRotation)
  const setScale = useEditorStore((s) => s.setScale)
  const setNodeSize = useEditorStore((s) => s.setNodeSize)
  const setNodeColor = useEditorStore((s) => s.setNodeColor)
  const labels = useObjectRegistry((s) => s.labels)

  const primaryId = selectedIds[0]
  if (!primaryId) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 text-xs text-slate-500">
        Clic en una pieza o cubo para editarla.
        {category === 'freeform' ? ' Usa + Cubo para crear.' : ''}
      </div>
    )
  }

  const node = sceneNodes[primaryId]
  const transform = node?.transform ?? transforms[primaryId]
  if (!transform) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 text-xs text-slate-500">
        Sin transform para la selección.
      </div>
    )
  }

  const toDeg = (rad: number) => (rad * 180) / Math.PI
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const title = node?.name ?? labels[primaryId] ?? primaryId

  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Transform
        </p>
        <p className="truncate text-xs font-medium text-slate-200">{title}</p>
        {selectedIds.length > 1 ? (
          <p className="text-[10px] text-amber-400/80">
            +{selectedIds.length - 1} más (gizmo en el primario)
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-1 text-[10px] text-slate-500">Position (m)</p>
        <div className="grid grid-cols-3 gap-1">
          <Field
            label="X"
            value={transform.position.x}
            step={0.05}
            onChange={(x) => setPosition(primaryId, { ...transform.position, x })}
          />
          <Field
            label="Y"
            value={transform.position.y}
            step={0.05}
            onChange={(y) => setPosition(primaryId, { ...transform.position, y })}
          />
          <Field
            label="Z"
            value={transform.position.z}
            step={0.05}
            onChange={(z) => setPosition(primaryId, { ...transform.position, z })}
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-[10px] text-slate-500">Rotation (°)</p>
        <div className="grid grid-cols-3 gap-1">
          <Field
            label="X"
            value={toDeg(transform.rotation.x)}
            step={5}
            onChange={(x) =>
              setRotation(primaryId, { ...transform.rotation, x: toRad(x) })
            }
          />
          <Field
            label="Y"
            value={toDeg(transform.rotation.y)}
            step={5}
            onChange={(y) =>
              setRotation(primaryId, { ...transform.rotation, y: toRad(y) })
            }
          />
          <Field
            label="Z"
            value={toDeg(transform.rotation.z)}
            step={5}
            onChange={(z) =>
              setRotation(primaryId, { ...transform.rotation, z: toRad(z) })
            }
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-[10px] text-slate-500">Scale</p>
        <div className="grid grid-cols-3 gap-1">
          <Field
            label="X"
            value={transform.scale.x}
            step={0.05}
            onChange={(x) => setScale(primaryId, { ...transform.scale, x })}
          />
          <Field
            label="Y"
            value={transform.scale.y}
            step={0.05}
            onChange={(y) => setScale(primaryId, { ...transform.scale, y })}
          />
          <Field
            label="Z"
            value={transform.scale.z}
            step={0.05}
            onChange={(z) => setScale(primaryId, { ...transform.scale, z })}
          />
        </div>
      </div>

      {node?.type === 'cube' ? (
        <>
          <div>
            <p className="mb-1 text-[10px] text-slate-500">Tamaño cubo (m)</p>
            <div className="grid grid-cols-3 gap-1">
              <Field
                label="X"
                value={node.size.x}
                step={0.05}
                onChange={(x) => setNodeSize(primaryId, { x })}
              />
              <Field
                label="Y"
                value={node.size.y}
                step={0.05}
                onChange={(y) => setNodeSize(primaryId, { y })}
              />
              <Field
                label="Z"
                value={node.size.z}
                step={0.05}
                onChange={(z) => setNodeSize(primaryId, { z })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-10">Color</span>
            <input
              type="color"
              value={node.color}
              onChange={(event) => setNodeColor(primaryId, event.target.value)}
              className="h-7 w-full cursor-pointer rounded border border-slate-700 bg-slate-950"
            />
          </label>
        </>
      ) : null}
    </div>
  )
}
