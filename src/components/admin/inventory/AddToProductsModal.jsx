import { useEffect, useState } from 'react'

export default function AddToProductsModal({ open, onClose, inventoryItem, categories = [], onSave }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (inventoryItem) {
      setForm({
        name: inventoryItem.productName || inventoryItem.name || '',
        sku: inventoryItem.sku || '',
        category: inventoryItem.category || categories[0]?.name || 'Uncategorized',
        description: inventoryItem.description || `Retail package for ${inventoryItem.productName || inventoryItem.name}`,
        qty: inventoryItem.qty || 10,
        unit: inventoryItem.unit || 'L',
        purchasePrice: inventoryItem.purchasePrice || 20,
        sellingPrice: inventoryItem.sellingPrice || 35,
        vendor: inventoryItem.vendor || '',
        batchNumber: inventoryItem.batchNumber || '',
        expiryDate: inventoryItem.expiryDate || '',
        minStock: 10,
        status: 'active',
      })
    }
  }, [inventoryItem, categories])

  if (!open || !inventoryItem) return null

  const handle = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const submit = () => {
    onSave({
      ...form,
      inventoryId: inventoryItem.id,
      productId: inventoryItem.productId || `prod_${Date.now()}`,
      qty: Number(form.qty || 0),
      purchasePrice: Number(form.purchasePrice || 0),
      sellingPrice: Number(form.sellingPrice || 0),
      minStock: Number(form.minStock || 10),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Add Inventory Item to Products for Sale</h3>
            <p className="mt-1 text-xs text-slate-500">
              Publish &quot;{inventoryItem.productName || inventoryItem.name}&quot; into the retail products catalog.
            </p>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-slate-400 hover:text-slate-700">Close</button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Product Name</label>
              <input
                value={form.name || ''}
                onChange={(e) => handle('name', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">SKU</label>
              <input
                value={form.sku || ''}
                onChange={(e) => handle('sku', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Category</label>
              <input
                value={form.category || ''}
                onChange={(e) => handle('category', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Unit</label>
              <input
                value={form.unit || ''}
                onChange={(e) => handle('unit', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Quantity for Sale</label>
              <input
                type="number"
                value={form.qty ?? 0}
                onChange={(e) => handle('qty', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-[11px] text-slate-400">Total in system stock: {inventoryItem.qty}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500">Selling Price (Rs)</label>
              <input
                type="number"
                value={form.sellingPrice || ''}
                onChange={(e) => handle('sellingPrice', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Purchase Price (Rs)</label>
              <input
                type="number"
                value={form.purchasePrice || ''}
                onChange={(e) => handle('purchasePrice', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Vendor</label>
              <input
                value={form.vendor || ''}
                onChange={(e) => handle('vendor', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Description</label>
            <textarea
              rows={2}
              value={form.description || ''}
              onChange={(e) => handle('description', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 border-t border-slate-100 pt-4">
          <button onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Cancel
          </button>
          <button onClick={submit} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            Add to Products
          </button>
        </div>
      </div>
    </div>
  )
}
