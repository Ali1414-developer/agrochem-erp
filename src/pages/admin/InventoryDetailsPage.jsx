import { useAuth } from '../../context/AuthContext'

export default function InventoryDetailsPage() {
  const { appData } = useAuth()

  const lowStockThreshold = 10

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-xl font-semibold text-slate-950">Inventory Status</h2>
        <p className="mt-2 text-sm text-slate-500">Live inventory quantities for all tracked products.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Warehouse</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Qty</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {appData.inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">{item.productName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.warehouse}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-950">{item.qty}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {item.qty < lowStockThreshold ? (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-600">Low stock</span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Healthy</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
