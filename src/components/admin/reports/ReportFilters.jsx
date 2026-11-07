import { useMemo } from 'react'

const dateOptions = [
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last 12 months' },
]

export default function ReportFilters({ categories, products, filters, onChange }) {
  const productOptions = useMemo(
    () => [{ value: 'all', label: 'All products' }, ...products.map((product) => ({ value: product.id, label: product.name }))],
    [products],
  )

  const categoryOptions = useMemo(
    () => [{ value: 'all', label: 'All categories' }, ...categories.map((name) => ({ value: name, label: name }))],
    [categories],
  )

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Analytics filters</p>
          <h2 className="text-xl font-semibold text-slate-950">Refine the report view</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4 w-full">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Date range</span>
            <select
              value={filters.dateRange}
              onChange={(event) => onChange({ ...filters, dateRange: event.target.value })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select
              value={filters.category}
              onChange={(event) => onChange({ ...filters, category: event.target.value })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Product</span>
            <select
              value={filters.product}
              onChange={(event) => onChange({ ...filters, product: event.target.value })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {productOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
