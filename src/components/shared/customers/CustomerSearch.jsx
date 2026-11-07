import { Search, X } from 'lucide-react'

export default function CustomerSearch({ value, onChange, onClear, placeholder = 'Search by name, phone or email' }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
        <Search size={18} />
      </div>
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-10 flex items-center text-slate-400 transition hover:text-slate-700"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  )
}
