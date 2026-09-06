import { MATERIAL_OPTIONS } from '../../constants/design'
import { useDesignStore } from '../../store/designStore'
import type { MaterialId } from '../../types/design'

export function MaterialSelector() {
  const materialId = useDesignStore((state) => state.materialId)
  const setMaterialId = useDesignStore((state) => state.setMaterialId)

  const selected = MATERIAL_OPTIONS.find((option) => option.id === materialId)

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">Materiales</h2>
        <p className="mt-1 text-xs text-slate-500">
          El color y acabado se usarán en el visor 3D y en la cotización.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="material-select"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Material
        </label>
        <select
          id="material-select"
          value={materialId}
          onChange={(event) => setMaterialId(event.target.value as MaterialId)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
        >
          {MATERIAL_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label} · {option.finish} ({option.category})
            </option>
          ))}
        </select>
      </div>

      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
          <span
            aria-hidden
            className="h-8 w-8 shrink-0 rounded-md border border-slate-700 shadow-inner"
            style={{ backgroundColor: selected.color }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">{selected.label}</p>
            <p className="text-xs capitalize text-slate-500">
              Acabado {selected.finish} · {selected.color}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
