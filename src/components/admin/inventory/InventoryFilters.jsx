export default function InventoryFilters({ categories = [], onCategoryChange, categoryValue, onStatusChange, statusValue, onSortChange, sortValue }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <select
        value={categoryValue}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={statusValue}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto"
      >
        <option value="">All stock</option>
        <option value="low">Low stock</option>
        <option value="out">Out of stock</option>
        <option value="sufficient">Sufficient</option>
        <option value="near-expiry">Near expiry</option>
      </select>

      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:w-auto"
      >
        <option value="">Sort</option>
        <option value="name">Name A → Z</option>
        <option value="name_desc">Name Z → A</option>
        <option value="qty">Quantity ↑</option>
        <option value="qty_desc">Quantity ↓</option>
        <option value="expiry">Expiry soon</option>
      </select>
    </div>
  )
}
// Single InventoryFilters component kept above; no-op to avoid duplicates
