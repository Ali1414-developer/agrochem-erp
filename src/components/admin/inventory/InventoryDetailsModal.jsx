import { X, Info } from 'lucide-react'

export default function InventoryDetailsModal({ item, open, onClose }) {
  if (!open || !item) return null

  const qty = item.qty ?? item.quantity ?? 0
  const purchasePrice = item.purchasePrice ?? null
  const sellingPrice = item.sellingPrice ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-xl max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Product details</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{item.productName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">SKU</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{item.sku || '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Category</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{item.category || '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Batch</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{item.batchNumber || '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Expiry</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{item.expiryDate || '—'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Quantity</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{qty}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Unit</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{item.unit || '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Vendor</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{item.vendor || '—'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Purchase price</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{purchasePrice != null ? `Rs ${Number(purchasePrice).toLocaleString()}` : '—'}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selling price</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{sellingPrice != null ? `Rs ${Number(sellingPrice).toLocaleString()}` : '—'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-emerald-50 p-5 text-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Info className="h-4 w-4" />
            <span>Inventory details are linked to the central ERP product state.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
