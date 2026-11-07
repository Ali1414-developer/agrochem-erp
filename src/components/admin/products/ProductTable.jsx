import { Eye, Edit2, Trash2 } from 'lucide-react'

export default function ProductTable({ items = [], onView, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No products found</p>
        <p className="mt-2 text-sm">Use the Add button to create a product.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{p.name}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{p.sku || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{p.category || '—'}</td>
              <td className="px-4 py-3 text-sm">
                {Number(p.qty || 0) === 0 ? (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                    0 (Out of stock)
                  </span>
                ) : Number(p.qty || 0) <= 10 ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-300">
                    {p.qty ?? 0} (Low stock)
                  </span>
                ) : (
                  <span className="font-semibold text-slate-900">{p.qty ?? 0}</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">{p.sellingPrice ? `Rs ${p.sellingPrice}` : '—'}</td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="inline-flex items-center gap-2">
                  {onView ? <button onClick={() => onView(p)} title="View" className="rounded-md p-2 text-slate-600 hover:bg-slate-100"><Eye size={16} /></button> : null}
                  {onEdit ? <button onClick={() => onEdit(p)} title="Edit" className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50"><Edit2 size={16} /></button> : null}
                  {onDelete ? <button onClick={() => onDelete(p)} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {items.map((p) => (
          <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                <p className="mt-1 text-xs text-slate-500">SKU: {p.sku || '—'}</p>
              </div>
              <div className="inline-flex items-center gap-2">
                {onView ? <button onClick={() => onView(p)} title="View" className="rounded-md p-2 text-slate-600 hover:bg-slate-100"><Eye size={16} /></button> : null}
                {onEdit ? <button onClick={() => onEdit(p)} title="Edit" className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50"><Edit2 size={16} /></button> : null}
                {onDelete ? <button onClick={() => onDelete(p)} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button> : null}
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">Category</span>
                <span>{p.category || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">Qty</span>
                <span>{Number(p.qty || 0) === 0 ? 'Out of stock' : p.qty}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">Price</span>
                <span>{p.sellingPrice ? `Rs ${p.sellingPrice}` : '—'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
