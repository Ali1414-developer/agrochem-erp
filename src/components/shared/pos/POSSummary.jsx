export default function POSSummary({ subtotal = 0, total = 0, onCheckout, disabled }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Sale summary</p>
          <p className="mt-2 text-sm text-slate-500">Ready the transaction for payment and confirm totals.</p>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={disabled}
          className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Pay now
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Tax</span>
          <span>Rs 0.00</span>
        </div>
        <div className="flex items-center justify-between rounded-3xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white">
          <span>Grand total</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
