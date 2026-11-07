export default function ReceiptModal({ open, onClose, onNewSale, receipt }) {
  if (!open || !receipt) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4 print:bg-transparent">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20 print:shadow-none">
        <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Receipt preview</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Invoice #{receipt.invoice}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Print receipt
            </button>
            <button
              type="button"
              onClick={onNewSale || onClose}
              className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              New sale
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-slate-700 print:text-black">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ERP</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">AgroChem ERP</p>
              <p className="text-sm text-slate-500">Pesticide supply and distribution.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Invoice</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{receipt.invoice}</p>
              <p className="text-sm text-slate-500">{receipt.date}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Payment</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{receipt.method}</p>
              <p className="text-sm text-slate-500">{receipt.customer.email || receipt.customer.phone || 'Walk-in customer'}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Customer</h3>
            <p className="mt-3 text-lg font-semibold text-slate-950">{receipt.customer.name || 'Walk-in customer'}</p>
            {receipt.customer.email ? <p className="text-sm text-slate-500">{receipt.customer.email}</p> : null}
            {receipt.customer.phone ? <p className="text-sm text-slate-500">{receipt.customer.phone}</p> : null}
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="bg-slate-950 px-5 py-4 text-sm uppercase tracking-[0.2em] text-white">Purchase details</div>
            <div className="divide-y divide-slate-200 bg-white px-5 py-4">
              {receipt.items.map((item) => (
                <div key={item.productId} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="text-sm text-slate-700">
                    <p>Qty: {item.quantity}</p>
                    <p>Unit: Rs {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right text-sm font-semibold text-slate-950">Rs {item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Subtotal</p>
              <p className="text-lg font-semibold text-slate-950">Rs {receipt.subtotal.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Grand total</p>
              <p className="text-lg font-semibold text-slate-950">Rs {receipt.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
