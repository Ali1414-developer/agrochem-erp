export default function TopProducts({ products }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Top selling products</p>
          <h2 className="text-xl font-semibold text-slate-950">Best performers</h2>
        </div>
      </div>
      {products.length ? (
        <div className="space-y-4">
          <div className="space-y-4 sm:hidden">
            {products.map((item) => (
              <div key={item.productId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>{item.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span>Rs {item.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-4 py-4 uppercase tracking-[0.2em]">Units</th>
                  <th className="px-4 py-4 uppercase tracking-[0.2em]">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {products.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-4 text-slate-700">{item.quantity.toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-900">Rs {item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No product sales available for the selected filters.
        </div>
      )}
    </div>
  )
}
