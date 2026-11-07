export default function ExpiryFilters({ filters, onChange }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Expiry filters</p>
          <h2 className="text-xl font-semibold text-slate-950">Search and sort batches</h2>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-3 xl:w-auto">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Search</span>
            <input
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
              placeholder="Product or batch"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              value={filters.status}
              onChange={(event) => onChange({ ...filters, status: event.target.value })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All statuses</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring soon</option>
              <option value="safe">Safe</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Sort</span>
            <select
              value={filters.sort}
              onChange={(event) => onChange({ ...filters, sort: event.target.value })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="expiryAsc">Expiry earliest</option>
              <option value="expiryDesc">Expiry latest</option>
              <option value="qtyDesc">Quantity high to low</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
