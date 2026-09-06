interface NumberFieldProps {
  id: string
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

export function NumberField({
  id,
  label,
  value,
  min = 0.01,
  max = 20,
  step = 0.01,
  unit = 'm',
  onChange,
}: NumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-slate-300">
          {label}
        </label>
        {unit ? <span className="text-[10px] uppercase text-slate-500">{unit}</span> : null}
      </div>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (Number.isNaN(next)) return
          onChange(next)
        }}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
      />
    </div>
  )
}
