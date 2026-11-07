import { Eye, Edit2, Trash2 } from 'lucide-react'

export default function VendorTable({ vendors = [], products = [], onView, onEdit, onDelete }) {
  if (!vendors.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 shadow-xl shadow-slate-300/30">
        <p className="text-lg font-semibold text-slate-900">No vendors available</p>
        <p className="mt-2 text-sm">Add a vendor to start managing purchases.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30 sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vendor</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Company</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Products</th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {vendors.map((vendor) => {
              const matchingProducts = vendor.suppliedProducts?.length
                ? vendor.suppliedProducts
                : products.filter((product) => product.vendor === vendor.name)

              return (
                <tr key={vendor.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">{vendor.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{vendor.company || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{vendor.phone || '—'}{vendor.email ? ` · ${vendor.email}` : ''}</td>
                  <td className="px-5 py-4 text-sm text-slate-900">{matchingProducts.length}</td>
                  <td className="px-5 py-4 text-right text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button type="button" onClick={() => onView(vendor)} className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100"><Eye size={16} /></button>
                      <button type="button" onClick={() => onEdit(vendor)} className="rounded-2xl p-2 text-emerald-600 hover:bg-emerald-50"><Edit2 size={16} /></button>
                      <button type="button" onClick={() => onDelete(vendor)} className="rounded-2xl p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 sm:hidden">
        {vendors.map((vendor) => {
          const matchingProducts = vendor.suppliedProducts?.length
            ? vendor.suppliedProducts
            : products.filter((product) => product.vendor === vendor.name)

          return (
            <div key={vendor.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-300/30">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{vendor.name}</p>
                    <p className="text-sm text-slate-500">{vendor.company || '—'}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{matchingProducts.length} products</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>{vendor.phone || '—'}</p>
                  <p>{vendor.email || '—'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onView(vendor)} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">View</button>
                  <button type="button" onClick={() => onEdit(vendor)} className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">Edit</button>
                  <button type="button" onClick={() => onDelete(vendor)} className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Delete</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
