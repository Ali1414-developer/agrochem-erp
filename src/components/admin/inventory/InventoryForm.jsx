import { useEffect, useState } from 'react'

export default function InventoryForm({ open, onClose, item, products = [], vendors = [], onSave }) {
  const [form, setForm] = useState({})

  const vendorOptions = Array.from(new Set(vendors.map((vendor) => vendor.name).filter(Boolean)))

  useEffect(() => {
    setForm(item ? { ...item } : { productName: '', sku: '', qty: 0, unit: '', warehouse: '', batchNumber: '', expiryDate: '', purchasePrice: '', sellingPrice: '', vendor: '', category: '' })
  }, [item])

  if (!open) return null

  const handle = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const submit = () => {
    onSave({ ...form, qty: Number(form.qty) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{item ? 'Edit inventory' : 'Add inventory'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500">Product</label>
            <select
              value={form.productName || ''}
              onChange={(e) => {
                handle('productName', e.target.value)
                const p = products.find((product) => product.name === e.target.value)
                if (p) {
                  handle('category', p.category || '')
                  handle('vendor', vendorOptions.includes(p.vendor) ? p.vendor : '')
                }
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select product</option>
              {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">SKU</label>
            <input value={form.sku || ''} onChange={(e)=>handle('sku', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Quantity</label>
            <input type="number" value={form.qty ?? 0} onChange={(e)=>handle('qty', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Unit</label>
            <input value={form.unit || ''} onChange={(e)=>handle('unit', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Warehouse</label>
            <input value={form.warehouse || ''} onChange={(e)=>handle('warehouse', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Batch number</label>
            <input value={form.batchNumber || ''} onChange={(e)=>handle('batchNumber', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Expiry date</label>
            <input type="date" value={form.expiryDate || ''} onChange={(e)=>handle('expiryDate', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Category</label>
            <input value={form.category || ''} onChange={(e)=>handle('category', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Purchase price</label>
            <input type="number" value={form.purchasePrice || ''} onChange={(e)=>handle('purchasePrice', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Selling price</label>
            <input type="number" value={form.sellingPrice || ''} onChange={(e)=>handle('sellingPrice', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Vendor</label>
            {vendorOptions.length ? (
              <select
                value={form.vendor || ''}
                onChange={(e) => handle('vendor', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select vendor</option>
                {vendorOptions.map((vendorName) => (
                  <option key={vendorName} value={vendorName}>{vendorName}</option>
                ))}
              </select>
            ) : (
              <input value={form.vendor || ''} onChange={(e)=>handle('vendor', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
