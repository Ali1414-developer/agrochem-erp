import { Search } from 'lucide-react'

export default function InventorySearch({ value, onChange, placeholder = 'Search by product name or SKU' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/50">
      <label htmlFor="inventory-search" className="sr-only">Search inventory</label>
      <div className="flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          id="inventory-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  )
}
