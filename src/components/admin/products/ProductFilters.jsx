export default function ProductFilters({ categories = [], onCategoryChange, categoryValue, onStatusChange, statusValue, onSortChange, sortValue }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select value={categoryValue} onChange={(e) => onCategoryChange(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto">
        <option value="">All categories</option>
        {categories.map((c) => (<option key={c.id || c.name} value={c.name}>{c.name}</option>))}
      </select>

      <select value={statusValue} onChange={(e) => onStatusChange(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto">
        <option value="">All stock</option>
        <option value="low">Low stock</option>
        <option value="out">Out of stock</option>
        <option value="sufficient">Sufficient</option>
      </select>

      <select value={sortValue} onChange={(e) => onSortChange(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto">
        <option value="">Sort</option>
        <option value="name">Name A → Z</option>
        <option value="name_desc">Name Z → A</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="qty_asc">Qty ↑</option>
        <option value="qty_desc">Qty ↓</option>
      </select>
    </div>
  )
}
