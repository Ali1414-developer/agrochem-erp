export default function SalesOverview({ salesSummary }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Sales Overview</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">Rs {salesSummary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{salesSummary.totalSales} sales</div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average sale</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">Rs {salesSummary.averageSale.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Largest sale</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">Rs {salesSummary.largestSale.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recent growth</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{salesSummary.growthPercent}%</p>
        </div>
      </div>
    </div>
  )
}
