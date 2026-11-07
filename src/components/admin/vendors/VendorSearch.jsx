export default function VendorSearch({ query, onQuery }) {
  return (
    <div className="w-full sm:w-72">
      <label className="sr-only" htmlFor="vendor-search">Search vendors</label>
      <input
        id="vendor-search"
        type="text"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search vendors by name, company, email"
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  )
}
