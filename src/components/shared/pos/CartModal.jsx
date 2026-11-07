import { X, ShoppingCart } from 'lucide-react'

export default function CartModal({
  open,
  onClose,
  cartItems = [],
  subtotal = 0,
  onPayNow,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-3xl rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 rounded-4xl bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cart summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Item added to cart</h2>
              <p className="mt-1 text-sm text-slate-500">Review the current sale before moving to payment.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            {cartItems.length === 0 ? (
              <div className="text-center text-sm text-slate-500">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="grid gap-3 rounded-3xl bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.quantity} × Rs {item.unitPrice.toFixed(2)} = Rs {item.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="rounded-3xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{item.quantity} pcs</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Sale total</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">Rs {subtotal.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={onPayNow}
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Pay now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
