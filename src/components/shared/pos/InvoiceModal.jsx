import { X } from 'lucide-react'

export default function InvoiceModal({ open, onClose, onConfirm, invoice, receipt, customer, cartItems, subtotal, total, paymentMethod }) {
  if (!open) return null

  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4">
      <div className="mx-auto w-full max-w-4xl rounded-4xl bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">AGROCHEM ERP</p>
            <h2 className="mt-1 text-3xl font-semibold text-slate-950">Invoice preview</h2>
            <p className="mt-2 text-sm text-slate-500">Review the sale details before final confirmation.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <X />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Invoice number</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{receipt?.invoice || invoice || 'Pending invoice'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date & time</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formattedDate} · {formattedTime}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customer</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{customer.name}</p>
            <p className="mt-2 text-sm text-slate-600">{customer.address}</p>
            <p className="mt-1 text-sm text-slate-600">{customer.phone}</p>
            {customer.email ? <p className="mt-1 text-sm text-slate-600">{customer.email}</p> : null}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{paymentMethod}</p>
            <p className="mt-3 text-sm text-slate-600">Status: Pending confirmation</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="bg-slate-950 px-5 py-4 text-sm uppercase tracking-[0.2em] text-white">Product details</div>
          <div className="divide-y divide-slate-200 bg-white px-5 py-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="grid gap-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.category || 'Uncategorized'} · SKU {item.sku || 'N/A'}</p>
                </div>
                <div className="space-y-1 text-right text-sm text-slate-700">
                  <p>{item.quantity} x Rs {item.unitPrice.toFixed(2)}</p>
                  <p className="font-semibold text-slate-950">Rs {item.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Subtotal</p>
            <p className="text-lg font-semibold text-slate-950">Rs {subtotal.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Grand total</p>
            <p className="text-lg font-semibold text-slate-950">Rs {total.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit sale
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Confirm order
          </button>
        </div>
      </div>
    </div>
  )
}
