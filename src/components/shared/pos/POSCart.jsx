import { Minus, Plus, Trash2 } from 'lucide-react'

export default function POSCart({ cartItems = [], onQuantityChange, onRemoveItem }) {
  if (!cartItems.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Cart is empty</p>
        <p className="mt-2 text-sm">Add products to start the sale.</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Cart</h3>
      </div>
      <div className="grid gap-4 p-6">
        {cartItems.map((item) => (
          <div key={item.productId} className="rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.category || 'Uncategorized'}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-3xl bg-slatewz-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.sku || 'No SKU'}</div>
                {onRemoveItem ? (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.productId)}
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
                <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                    className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                    className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
                <p className="text-sm font-semibold text-slate-900">Rs {item.totalPrice.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unit price</p>
                <p className="text-sm font-semibold text-slate-900">Rs {item.unitPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
