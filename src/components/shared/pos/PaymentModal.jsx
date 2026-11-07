import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const paymentMethods = ['Cash', 'Card', 'Other']

export default function PaymentModal({ open, onClose, amount = 0, onConfirm }) {
  const [method, setMethod] = useState('Cash')
  const [reference, setReference] = useState('')

  useEffect(() => {
    if (open) {
      setMethod('Cash')
      setReference('')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Payment confirmation</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Finalize transaction</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <X />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Amount due</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">Rs {amount.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current method</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{method}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment type</p>
            <p className="mt-3 text-sm text-slate-600">Cash, card, or other methods can be recorded here.</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Select payment method</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setMethod(option)}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${method === option ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700">Payment reference</label>
          <textarea
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Optional reference or payment details"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            rows={4}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-3xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ method, reference })}
            className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Confirm payment
          </button>
        </div>
      </div>
    </div>
  )
}
