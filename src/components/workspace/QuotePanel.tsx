import { formatCLP, formatQty } from '../../lib/format'
import { useLiveQuote } from '../../hooks/useLiveQuote'

export function QuotePanel() {
  const { quote, loading, error } = useLiveQuote()

  return (
    <section className="space-y-3 border-t border-slate-800 pt-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Cotización</h2>
          <p className="mt-1 text-xs text-slate-500">
            Cálculo en tiempo real vía <code className="text-slate-400">/api/quote</code>
          </p>
        </div>
        {loading ? (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">
            Calculando…
          </span>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-xs text-rose-200">
          {error}
        </div>
      ) : null}

      {quote ? (
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <ul className="space-y-2">
            {quote.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-200">{item.label}</p>
                  <p className="text-slate-500">
                    {formatQty(item.quantity, item.unit)} × {formatCLP(item.unitPrice)}
                  </p>
                </div>
                <p className="shrink-0 font-medium text-slate-100">
                  {formatCLP(item.total)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-1 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal material</span>
              <span>{formatCLP(quote.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mano de obra</span>
              <span>{formatCLP(quote.labor)}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold text-amber-300">
              <span>Total</span>
              <span>{formatCLP(quote.total)}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-600">
            Área paneles: {quote.totalAreaM2.toFixed(3)} m² · Volumen:{' '}
            {quote.totalVolumeM3.toFixed(4)} m³
          </p>
        </div>
      ) : null}

      {!quote && !error && loading ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-3 py-6 text-center text-xs text-slate-500">
          Obteniendo cotización…
        </div>
      ) : null}
    </section>
  )
}
