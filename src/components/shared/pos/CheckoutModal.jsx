import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const paymentMethods = ['Cash', 'Card', 'Other']

export default function CheckoutModal({
  open,
  onClose,
  cartItems = [],
  subtotal = 0,
  total = 0,
  customer = {},
  paymentMethod = 'Cash',
  onCustomerChange,
  onPaymentMethodChange,
  onConfirm,
}) {
  const [reference, setReference] = useState('')

  useEffect(() => {
    if (open) {
      setReference('')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">
      <div className="mx-auto w-full max-w-4xl rounded-4xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Finalize sale</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Customer & payment</h2>
            <p className="mt-1 text-sm text-slate-500">Fill customer details and choose a payment method before placing the order.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
          >
            <X />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Customer details</p>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-900">Full name</span>
                <input
                  value={customer.name || ''}
                  onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
                  placeholder="Customer full name"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-900">Address</span>
                <input
                  value={customer.address || ''}
                  onChange={(e) => onCustomerChange({ ...customer, address: e.target.value })}
                  placeholder="Customer address"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-600">
                  <span className="mb-2 block font-medium text-slate-900">Phone</span>
                  <input
                    value={customer.phone || ''}
                    onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
                    placeholder="Customer phone"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  <span className="mb-2 block font-medium text-slate-900">Email</span>
                  <input
                    value={customer.email || ''}
                    onChange={(e) => onCustomerChange({ ...customer, email: e.target.value })}
                    placeholder="Customer email"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Payment method</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onPaymentMethodChange(option)}
                    className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${paymentMethod === option ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <label className="text-sm font-semibold text-slate-700">Payment reference</label>
              <textarea
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Payment note, transaction reference, or instructions"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Sale summary</p>
              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.productId} className="grid gap-3 rounded-3xl bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.quantity} × Rs {item.unitPrice.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-slate-900">Rs {item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>Tax</span>
                <span>Rs 0.00</span>
              </div>
              <div className="mt-4 rounded-3xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white">
                <div className="flex items-center justify-between">
                  <span>Grand total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onConfirm({ paymentMethod, reference })}
              className="w-full rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
