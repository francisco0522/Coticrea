import { CATEGORY_OPTIONS } from '../../constants/design'
import { useDesignStore } from '../../store/designStore'
import { CategorySelector } from './CategorySelector'

export function ConfigPanel() {
  const category = useDesignStore((state) => state.category)
  const materialId = useDesignStore((state) => state.materialId)
  const resetCurrentCategory = useDesignStore(
    (state) => state.resetCurrentCategory,
  )

  const categoryLabel =
    CATEGORY_OPTIONS.find((option) => option.id === category)?.label ?? category

  return (
    <aside className="flex h-full w-full max-w-sm flex-col border-r border-slate-800 bg-slate-950">
      <header className="border-b border-slate-800 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Coticrea
        </p>
        <h1 className="mt-1 text-lg font-semibold text-slate-100">
          Panel de configuración
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Ajusta categoría, dimensiones y materiales del diseño.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <CategorySelector />

        <section className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-medium text-slate-200">
            Controles dinámicos
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Los inputs de <span className="text-slate-300">{categoryLabel}</span>{' '}
            se conectarán en el Paso 3. El estado del store ya está listo para
            recibir cambios de dimensiones y opciones.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-medium text-slate-200">Materiales</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Material activo en el store:{' '}
            <span className="font-medium text-slate-300">{materialId}</span>. El
            selector completo se añadirá junto a los controles dinámicos.
          </p>
        </section>
      </div>

      <footer className="border-t border-slate-800 px-5 py-4">
        <button
          type="button"
          onClick={resetCurrentCategory}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          Restablecer {categoryLabel}
        </button>
      </footer>
    </aside>
  )
}
