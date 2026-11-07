import { X } from 'lucide-react'

export default function VendorDetailsModal({ open, vendor, onClose }) {
  if (!open || !vendor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{vendor.name}</h3>
            <p className="text-xs text-slate-500">{vendor.company}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Phone</p>
            <p className="mt-1 text-xs font-medium text-slate-900">{vendor.phone || '—'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Email</p>
            <p className="mt-1 text-xs font-medium text-slate-900">{vendor.email || '—'}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Address</p>
            <p className="mt-1 text-xs text-slate-900">{vendor.address || '—'}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Notes</p>
            <p className="mt-1 text-xs text-slate-900">{vendor.notes || 'No notes added.'}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Supplied products</p>
          {vendor.suppliedProducts?.length ? (
            <ul className="mt-2 space-y-2 text-xs text-slate-700 max-h-48 overflow-y-auto pr-1">
              {vendor.suppliedProducts.map((item, idx) => (
                <li key={item.productId || idx} className="rounded-xl bg-white p-2.5 shadow-xs border border-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="text-xs font-semibold text-emerald-700">{item.qty} units</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Batch: {item.batchNumber || 'N/A'} · Expiry: {item.expiryDate || 'N/A'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No supplied products recorded yet.</p>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Purchase history</p>
          {vendor.purchaseHistory?.length ? (
            <div className="mt-3 space-y-3">
              {vendor.purchaseHistory.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{order.productName || 'Purchase order'}</p>
                      <p className="text-[11px] text-slate-500">{order.date || 'Unknown date'} · {order.status || 'Upcoming'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">Rs {Number(order.total || 0).toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500">{order.paymentPlan || 'Full'} · {order.paymentStatus || 'Paid'}</p>
                      {Number(order.dueAmount || 0) > 0 ? (
                        <p className="text-[11px] text-rose-600">Due Rs {Number(order.dueAmount || 0).toLocaleString()}{order.dueDate ? ` on ${order.dueDate}` : ''}{order.dueTime ? ` ${order.dueTime}` : ''}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Amount paid</p>
                      <p className="mt-1 font-semibold text-slate-900">Rs {Number(order.amountPaid || 0).toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Expected delivery</p>
                      <p className="mt-1 font-semibold text-slate-900">{order.expectedDeliveryDate || '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No purchase history yet for this vendor.</p>
          )}
        </div>

        <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
          <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
