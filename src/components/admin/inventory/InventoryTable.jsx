import { Eye, Edit2, Trash2, PlusCircle } from 'lucide-react'

export default function InventoryTable({ items = [], onView, onEdit, onDelete, onAddToProducts, isLoading = false, lowStockThreshold = 15 }) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm shadow-slate-200/50">
        Loading inventory...
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 shadow-sm shadow-slate-200/50">
        <p className="text-lg font-semibold text-slate-900">No inventory items match your search.</p>
        <p className="mt-2 text-sm">Try adjusting filters, search terms, or sorting options.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden sm:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="overflow-hidden">
          <table className="min-w-full text-left text-sm leading-6 text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">SKU</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Qty</th>
                <th className="px-3 py-3 font-semibold">Unit</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Batch</th>
                <th className="px-3 py-3 font-semibold">Expiry</th>
                <th className="px-3 py-3 font-semibold">Vendor</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.map((item) => {
                const qty = item.qty ?? item.quantity ?? 0
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 align-top font-semibold text-slate-950 whitespace-normal">{item.productName}</td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.sku || '—'}</td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.category || '—'}</td>
                    <td className="px-3 py-3 align-top font-semibold text-slate-900">{qty}</td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.unit || '—'}</td>
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          qty === 0 ? 'bg-rose-50 text-rose-700' : qty <= lowStockThreshold ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {qty === 0 ? 'Out of stock' : qty <= lowStockThreshold ? 'Low stock' : 'In stock'}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.batchNumber || '—'}</td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.expiryDate || '—'}</td>
                    <td className="px-3 py-3 align-top text-slate-500 whitespace-normal">{item.vendor || '—'}</td>
                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-1.5">
                        {onAddToProducts ? (
                          <button
                            type="button"
                            onClick={() => onAddToProducts(item)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            title="Add item to Products for Sale"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>Add to Products</span>
                          </button>
                        ) : null}
                        {onView ? (
                          <button
                            type="button"
                            onClick={() => onView(item)}
                            className="p-1.5 text-slate-600 transition hover:text-slate-900"
                            aria-label="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        ) : null}
                        {onEdit ? (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-emerald-600 transition hover:text-emerald-700"
                            aria-label="Edit inventory"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        ) : null}
                        {onDelete ? (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-1.5 text-rose-600 transition hover:text-rose-700"
                            aria-label="Delete inventory"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 sm:hidden">
        {items.map((item) => {
          const qty = item.qty ?? item.quantity ?? 0
          return (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.productName}</p>
                    <p className="mt-1 text-xs text-slate-500">SKU: {item.sku || '—'}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{qty}</span>
                </div>
                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Category</span><span>{item.category || '—'}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Unit</span><span>{item.unit || '—'}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Status</span><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${qty === 0 ? 'bg-rose-50 text-rose-700' : qty <= lowStockThreshold ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{qty === 0 ? 'Out of stock' : qty <= lowStockThreshold ? 'Low stock' : 'In stock'}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Batch</span><span>{item.batchNumber || '—'}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Expiry</span><span>{item.expiryDate || '—'}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-900">Vendor</span><span>{item.vendor || '—'}</span></div>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  {onAddToProducts ? (
                    <button
                      type="button"
                      onClick={() => onAddToProducts(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add to Products
                    </button>
                  ) : null}
                  {onView ? (
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                      aria-label="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  ) : null}
                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                      aria-label="Edit inventory"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                      aria-label="Delete inventory"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
