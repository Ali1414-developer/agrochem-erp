import { Search } from 'lucide-react'

export default function ProductSearch({ value, onChange, onSearch }) {
  const handleInput = (value) => {
    if (typeof onSearch === 'function') {
      onSearch(value)
      return
    }
    onChange?.(value)
  }

  return (
    <div className="relative w-full max-w-full sm:max-w-md">
      <input
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search products by name or SKU"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <div className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
        <Search size={16} />
      </div>
    </div>
  )
}
