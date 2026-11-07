import { useAuth } from '../../context/AuthContext'
import { getLowStockThreshold } from '../../utils/stock'

export default function InventoryPage() {
  const { appData } = useAuth()
  const lowStockThreshold = getLowStockThreshold(appData.settings)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Inventory</h2>
            <p className="mt-2 text-sm text-slate-500">Track stock levels across warehouses and monitor low inventory.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {appData.inventory.length} items tracked
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Warehouse</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quantity</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {appData.inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-950">{item.productName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.warehouse}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.qty}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.qty < lowStockThreshold ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {item.qty < lowStockThreshold ? 'Reorder' : 'Sufficient'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
