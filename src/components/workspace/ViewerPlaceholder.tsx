import { CATEGORY_OPTIONS } from '../../constants/design'
import { useDesignStore } from '../../store/designStore'

export function ViewerPlaceholder() {
  const category = useDesignStore((state) => state.category)
  const materialId = useDesignStore((state) => state.materialId)
  const desk = useDesignStore((state) => state.desk)
  const dining = useDesignStore((state) => state.dining)
  const closet = useDesignStore((state) => state.closet)
  const closetOptions = useDesignStore((state) => state.closetOptions)
  const structure = useDesignStore((state) => state.structure)
  const structureOptions = useDesignStore((state) => state.structureOptions)

  const categoryLabel =
    CATEGORY_OPTIONS.find((option) => option.id === category)?.label ?? category

  const summary = (() => {
    switch (category) {
      case 'escritorio':
        return `${desk.length} × ${desk.width} × ${desk.height} m · grosor ${desk.thickness} m`
      case 'comedor':
        return `${dining.length} × ${dining.width} × ${dining.height} m · grosor ${dining.thickness} m`
      case 'closet':
        return `${closet.length} × ${closet.depth} × ${closet.height} m · ${closetOptions.shelves} estantes · ${closetOptions.verticalDivisions} divisiones`
      case 'estructura':
        return `${structure.length} × ${structure.width} × ${structure.height} m · ${structureOptions.beamCount} vigas · paso ${structureOptions.pillarSpacing} m`
    }
  })()

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Visor 3D</h2>
          <p className="text-xs text-slate-500">
            React Three Fiber se integrará en el Paso 4
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
          {categoryLabel}
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 mx-6 max-w-lg rounded-2xl border border-slate-700/80 bg-slate-950/80 p-6 text-center shadow-2xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            Vista previa
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-50">
            {categoryLabel}
          </h3>
          <p className="mt-2 text-sm text-slate-400">{summary}</p>
          <p className="mt-4 text-xs text-slate-500">
            Material: <span className="text-slate-300">{materialId}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
