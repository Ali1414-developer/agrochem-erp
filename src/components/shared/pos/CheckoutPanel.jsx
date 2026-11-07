import { CreditCard, DollarSign, ShoppingBag } from 'lucide-react'

export default function CheckoutPanel({ subtotal, total, paymentMethod, onSelectPaymentMethod, onOpenInvoice, disabled }) {
  const paymentMethods = ['Cash', 'Card', 'Other']

  return (
    <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/70 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)]">
      <div>
        <p className="text-sm font-semibold text-slate-900">Checkout details</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Tax</span>
          <span>Rs 0.00</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
          <span>Total</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment method</p>
        <div className="mt-3 grid gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onSelectPaymentMethod(method)}
              className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${paymentMethod === method ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                {method === 'Cash' ? <DollarSign size={18} /> : method === 'Card' ? <CreditCard size={18} /> : <ShoppingBag size={18} />}
                <span>{method}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onOpenInvoice}
        className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Pay Now
      </button>
    </div>
  )
}
