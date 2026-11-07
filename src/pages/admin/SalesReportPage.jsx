import { useAuth } from '../../context/AuthContext'

export default function SalesReportPage() {
  const { appData } = useAuth()

  const totalRevenue = appData.sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalSales = appData.sales.length
  const averageSale = totalSales ? Math.round(totalRevenue / totalSales) : 0
  const lastSale = appData.sales[appData.sales.length - 1]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-xl font-semibold text-slate-950">Sales Analytics</h2>
        <p className="mt-2 text-sm text-slate-500">Business performance snapshot across recorded transactions.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">Rs {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sales</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{totalSales}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Average Order</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">Rs {averageSale.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Latest Sale</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">Rs {lastSale?.amount.toLocaleString() ?? 0}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="px-6 py-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Recent Transactions</div>
        <div className="divide-y divide-slate-200">
          {appData.sales.map((sale) => (
            <div key={sale.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">{sale.description}</p>
                <p className="text-sm text-slate-500">{sale.date}</p>
              </div>
              <p className="text-lg font-semibold text-slate-900">Rs {sale.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
