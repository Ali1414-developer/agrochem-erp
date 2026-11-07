import { X, Package, Box } from 'lucide-react'

export default function CategoryProductsModal({ open, onClose, categoryName, products = [] }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Products in &quot;{categoryName}&quot;
              </h3>
              <p className="text-xs text-slate-500">
                Showing {products.length} {products.length === 1 ? 'product' : 'products'} assigned to this category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Box size={32} />
              </div>
              <h4 className="mt-4 text-base font-semibold text-slate-800">No products found</h4>
              <p className="mt-1 text-sm text-slate-500">
                There are currently no products under the category &quot;{categoryName}&quot;.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Stock / Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {products.map((p) => (
                    <tr key={p.id || p.name} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">
                        {p.sku || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm font-medium">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            Number(p.qty || 0) === 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : Number(p.qty || 0) <= Number(p.minStock || 10)
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {p.qty ?? 0} {p.unit || ''}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-900">
                        {p.sellingPrice ? `Rs ${p.sellingPrice}` : p.price ? `Rs ${p.price}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
