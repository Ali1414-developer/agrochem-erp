export default function PrintableInvoice({ receipt, customer, cartItems, subtotal, total, paymentMethod }) {
  if (!receipt) return null

  return (
    <div className="prose mx-auto my-8 max-w-4xl print:prose-sm print:text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg print:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">AGROCHEM ERP</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Sales receipt</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Invoice #{receipt.invoice}</p>
            <p className="text-sm text-slate-500">{receipt.date}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Customer</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{customer.name}</p>
            <p className="mt-1 text-sm text-slate-600">{customer.address}</p>
            <p className="mt-1 text-sm text-slate-600">{customer.phone}</p>
            {customer.email ? <p className="mt-1 text-sm text-slate-600">{customer.email}</p> : null}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Payment</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{paymentMethod}</p>
            <p className="mt-1 text-sm text-slate-600">Status: Paid</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
          <div className="bg-slate-950 px-5 py-4 text-sm uppercase tracking-[0.2em] text-white">Order details</div>
          <div className="divide-y divide-slate-200 bg-white px-5 py-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="grid gap-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.category || 'Uncategorized'}</p>
                </div>
                <div className="text-right text-sm text-slate-700">
                  <p>{item.quantity} x Rs {item.unitPrice.toFixed(2)}</p>
                  <p className="font-semibold text-slate-950">Rs {item.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Subtotal</p>
            <p className="text-lg font-semibold text-slate-950">Rs {subtotal.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-lg font-semibold text-slate-950">Rs {total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
