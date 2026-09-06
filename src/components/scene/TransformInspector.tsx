import { useEditorStore } from '../../store/editorStore'
import { MODEL_OBJECT_ID } from '../../types/editor'

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
  const transform = useEditorStore((state) => state.transforms[MODEL_OBJECT_ID])
  const setPosition = useEditorStore((state) => state.setPosition)
  const setRotation = useEditorStore((state) => state.setRotation)
  const setScale = useEditorStore((state) => state.setScale)
  const selectedId = useEditorStore((state) => state.selectedId)

  if (!transform || selectedId !== MODEL_OBJECT_ID) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 text-xs text-slate-500">
        Selecciona el modelo (clic) para editar transform.
      </div>
    )
  }

  const toDeg = (rad: number) => (rad * 180) / Math.PI
  const toRad = (deg: number) => (deg * Math.PI) / 180

  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Transform
      </p>

      <div>
        <p className="mb-1 text-[10px] text-slate-500">Position (m)</p>
        <div className="grid grid-cols-3 gap-1">
          <Field
            label="X"
            value={transform.position.x}
            step={0.05}
            onChange={(x) => setPosition(MODEL_OBJECT_ID, { ...transform.position, x })}
          />
          <Field
            label="Y"
            value={transform.position.y}
            step={0.05}
            onChange={(y) => setPosition(MODEL_OBJECT_ID, { ...transform.position, y })}
          />
          <Field
            label="Z"
            value={transform.position.z}
            step={0.05}
            onChange={(z) => setPosition(MODEL_OBJECT_ID, { ...transform.position, z })}
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
              setRotation(MODEL_OBJECT_ID, { ...transform.rotation, x: toRad(x) })
            }
          />
          <Field
            label="Y"
            value={toDeg(transform.rotation.y)}
            step={5}
            onChange={(y) =>
              setRotation(MODEL_OBJECT_ID, { ...transform.rotation, y: toRad(y) })
            }
          />
          <Field
            label="Z"
            value={toDeg(transform.rotation.z)}
            step={5}
            onChange={(z) =>
              setRotation(MODEL_OBJECT_ID, { ...transform.rotation, z: toRad(z) })
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
            onChange={(x) => setScale(MODEL_OBJECT_ID, { ...transform.scale, x })}
          />
          <Field
            label="Y"
            value={transform.scale.y}
            step={0.05}
            onChange={(y) => setScale(MODEL_OBJECT_ID, { ...transform.scale, y })}
          />
          <Field
            label="Z"
            value={transform.scale.z}
            step={0.05}
            onChange={(z) => setScale(MODEL_OBJECT_ID, { ...transform.scale, z })}
          />
        </div>
      </div>
    </div>
  )
}
