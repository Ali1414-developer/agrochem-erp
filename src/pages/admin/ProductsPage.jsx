import { useAuth } from '../../context/AuthContext'

export default function ProductsPage() {
  const { appData } = useAuth()
  const lowStockThreshold = getLowStockThreshold(appData.settings)

  return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Products</h2>
            <p className="mt-2 text-sm text-slate-500">Complete product catalog with category and stock reference.</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {appData.products.map((product) => {
              const inventoryItem = appData.inventory.find((item) => item.productName === product.name)
              const qty = inventoryItem?.qty ?? 0
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-950">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{qty}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${qty <= (product.minStock || lowStockThreshold) ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700'}`}>
                      {qty <= (product.minStock || lowStockThreshold) ? 'Low stock' : 'In stock'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
