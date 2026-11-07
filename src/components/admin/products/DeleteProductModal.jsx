import { X, Trash2 } from 'lucide-react'

export default function DeleteProductModal({ open, onClose, onConfirm, product }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Delete product</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X /></button>
        </div>

        <p className="mt-4 text-sm text-slate-600">Are you sure you want to delete <span className="font-semibold text-slate-900">{product.name}</span>? Existing inventory and sales records will be preserved but product links will be updated.</p>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button onClick={() => onConfirm(product.id)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-2"><Trash2 size={16} />Delete</button>
        </div>
      </div>
    </div>
  )
}
