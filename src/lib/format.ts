const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export function formatCLP(value: number): string {
  return clpFormatter.format(value)
}

export function formatQty(value: number, unit: string): string {
  const digits = unit === 'm3' ? 4 : unit === 'm2' ? 3 : 0
  return `${value.toFixed(digits)} ${unit}`
}
