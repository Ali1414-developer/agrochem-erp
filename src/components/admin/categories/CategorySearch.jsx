import { Search } from 'lucide-react'

export default function CategorySearch({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search categories"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <div className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
        <Search size={16} />
      </div>
    </div>
  )
}
