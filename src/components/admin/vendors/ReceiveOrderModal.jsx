import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function ReceiveOrderModal({ open, order, onClose, onConfirm }) {
  const [form, setForm] = useState({
    batchNumber: '',
    expiryDate: '',
    purchasePrice: '',
  })

  useEffect(() => {
    if (!open) {
      setForm({ batchNumber: '', expiryDate: '', purchasePrice: '' })
    }
  }, [open])

  if (!open || !order) return null

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = () => {
    if (!form.batchNumber || !form.expiryDate || !form.purchasePrice) {
      alert('Batch number, expiry date, and purchase price are required when receiving the order.')
      return
    }

    onConfirm({
      orderId: order.id,
      batchNumber: form.batchNumber,
      expiryDate: form.expiryDate,
      purchasePrice: Number(form.purchasePrice),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Receive purchase order</h3>
            <p className="mt-1 text-sm text-slate-500">Enter the actual delivered details before the stock is added to inventory.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vendor</p>
            <p className="mt-2 font-semibold text-slate-900">{order.vendorName}</p>
            <p className="mt-1 text-sm text-slate-500">{order.productName}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
            <p className="mt-2 font-semibold text-slate-900">{order.quantity}</p>
            <p className="mt-1 text-sm text-slate-500">Expected purchase price: {order.purchasePrice || '—'}</p>
          </div>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Batch number</span>
            <input
              type="text"
              value={form.batchNumber}
              onChange={(e) => handleChange('batchNumber', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Enter batch number"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Expiry date</span>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
            <span>Actual purchase price</span>
            <input
              type="number"
              min="0"
              value={form.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Enter actual purchase price"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Cancel
          </button>
          <button type="button" onClick={submit} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Confirm delivery
          </button>
        </div>
      </div>
    </div>
  )
}
