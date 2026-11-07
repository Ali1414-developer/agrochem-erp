import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function ProductForm({ open, onClose, product, categories = [], onSave }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (product) setForm({ ...product })
    else setForm({ name: '', sku: '', category: '', description: '', qty: 0, unit: '', purchasePrice: '', sellingPrice: '', vendor: '', batchNumber: '', mfgDate: '', expiryDate: '', minStock: 0, status: 'active' })
  }, [product])

  if (!open) return null

  const handle = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const submit = () => {
    if (!form.name || !form.category) { alert('Product name and category are required'); return }
    // normalize numbers
    const out = { ...form, qty: Number(form.qty || 0), purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null, sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : null, minStock: Number(form.minStock || 0) }
    onSave(out)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-[0_25px_60px_-20px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{product ? 'Edit product' : 'Add product'}</h3>
            <p className="mt-1 text-sm text-slate-500">Update product details and inventory information in one place.</p>
          </div>
          <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Product name</label>
            <input
              value={form.name || ''}
              onChange={(e) => handle('name', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">SKU</label>
            <input
              value={form.sku || ''}
              onChange={(e) => handle('sku', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</label>
            <select
              value={form.category || ''}
              onChange={(e) => handle('category', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Unit</label>
            <input
              value={form.unit || ''}
              onChange={(e) => handle('unit', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quantity</label>
            <input
              type="number"
              value={form.qty ?? 0}
              onChange={(e) => handle('qty', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Minimum stock</label>
            <input
              type="number"
              value={form.minStock ?? 0}
              onChange={(e) => handle('minStock', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Purchase price</label>
            <input
              type="number"
              value={form.purchasePrice ?? ''}
              onChange={(e) => handle('purchasePrice', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Selling price</label>
            <input
              type="number"
              value={form.sellingPrice ?? ''}
              onChange={(e) => handle('sellingPrice', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Vendor</label>
            <input
              value={form.vendor || ''}
              onChange={(e) => handle('vendor', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Batch number</label>
            <input
              value={form.batchNumber || ''}
              onChange={(e) => handle('batchNumber', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mfg date</label>
            <input
              type="date"
              value={form.mfgDate || ''}
              onChange={(e) => handle('mfgDate', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Expiry date</label>
            <input
              type="date"
              value={form.expiryDate || ''}
              onChange={(e) => handle('expiryDate', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handle('description', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
              rows={4}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-0 py-4 backdrop-blur-sm sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Save product
          </button>
        </div>
      </div>
    </div>
  )
}
