import { Trash2 } from 'lucide-react'

export default function CartPanel({ cartItems = [], onQuantityChange, onRemoveItem, onClearCart }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="flex h-full max-h-[calc(100vh-10rem)] flex-col space-y-5 rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50/60 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Current sale</p>
        </div>
        <button
          type="button"
          onClick={onClearCart}
          disabled={!cartItems.length}
          className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={16} /> Clear cart
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-900">Your cart is empty</p>
          <p className="mt-2">Select products from the catalog to start a new sale.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-4 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item.productId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.category || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.productId)}
                      className="rounded-full p-1 text-slate-400 transition hover:text-rose-600"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Rs {item.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">Unit Rs {item.unitPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                    className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.availableQty}
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.productId, Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.productId, Math.min(item.availableQty, item.quantity + 1))}
                    className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-500">Available: {item.availableQty}</div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
