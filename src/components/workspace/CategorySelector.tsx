import { CATEGORY_OPTIONS } from '../../constants/design'
import { useDesignStore } from '../../store/designStore'
import type { DesignCategory } from '../../types/design'

export function CategorySelector() {
  const category = useDesignStore((state) => state.category)
  const setCategory = useDesignStore((state) => state.setCategory)

  const selected = CATEGORY_OPTIONS.find((option) => option.id === category)

  return (
    <div className="space-y-2">
      <label
        htmlFor="category-select"
        className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        Categoría
      </label>
      <select
        id="category-select"
        value={category}
        onChange={(event) => setCategory(event.target.value as DesignCategory)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
      >
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {selected ? (
        <p className="text-xs leading-relaxed text-slate-500">{selected.description}</p>
      ) : null}
    </div>
  )
}
