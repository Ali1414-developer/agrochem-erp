import { X } from 'lucide-react'

export default function BatchDetailsModal({ open, batch, onClose }) {
  if (!open || !batch) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Batch details</p>
            <h2 className="text-xl font-semibold text-slate-950">{batch.productName}</h2>
          </div>
          <button onClick={onClose} className="rounded-2xl p-2 text-slate-600 transition hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Batch number</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.batchNumber || 'N/A'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Expiry date</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.expiryDate}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Quantity</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.qty}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.location || batch.warehouse || 'Unknown'}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.category || 'Uncategorized'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Vendor</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{batch.vendor || 'Unknown'}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Product description</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{batch.description || 'No description available.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
