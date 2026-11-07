import { X } from 'lucide-react'

export default function ProductDetailsModal({ open, onClose, product }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X /></button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <div className="text-slate-500">SKU</div>
            <div className="font-semibold text-slate-900">{product.sku || '—'}</div>
          </div>
          <div>
            <div className="text-slate-500">Category</div>
            <div className="font-semibold text-slate-900">{product.category || '—'}</div>
          </div>
          <div>
            <div className="text-slate-500">Quantity</div>
            <div className="font-semibold text-slate-900">
              {Number(product.qty || 0) === 0 ? (
                <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                  0 (Out of stock)
                </span>
              ) : Number(product.qty || 0) <= Number(product.minStock ?? 10) ? (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  {product.qty ?? 0} (Low stock)
                </span>
              ) : (
                product.qty ?? 0
              )}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Unit</div>
            <div className="font-semibold text-slate-900">{product.unit || '—'}</div>
          </div>
          <div>
            <div className="text-slate-500">Purchase price</div>
            <div className="font-semibold text-slate-900">{product.purchasePrice ? `Rs ${product.purchasePrice}` : '—'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400">Selling Price</div>
            <div className="font-semibold text-slate-900">{product.sellingPrice ? `Rs ${product.sellingPrice}` : '—'}</div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-500">Description</div>
            <div className="mt-2 text-sm text-slate-700">{product.description || '—'}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>
      </div>
    </div>
  )
}
