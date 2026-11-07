import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function ProductSelector({ products = [], selectedProduct, quantity = 1, onSelectProduct, onQuantityChange, onAddToCart }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const query = search.trim().toLowerCase()
      if (!query) return true
      return (
        product.name.toLowerCase().includes(query) ||
        (product.sku || '').toLowerCase().includes(query) ||
        (product.category || '').toLowerCase().includes(query)
      )
    })
  }, [products, search])

  const availableQty = selectedProduct ? Number(selectedProduct.availableQty || 0) : 0
  const remainingStock = selectedProduct ? Math.max(0, availableQty) : 0

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div>
        <p className="text-sm font-semibold text-slate-900">Select product</p>
        <p className="mt-1 text-sm text-slate-500">Choose from active catalog items and add them to the cart.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU, or category"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={16} />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filtered.length > 0 ? (
            filtered.map((product) => {
              const isActive = selectedProduct?.id === product.id
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className={`w-full px-4 py-4 text-left transition ${isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.category || 'Uncategorized'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{product.sellingPrice ? `Rs ${product.sellingPrice}` : 'N/A'}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.sku || 'SKU not set'}</p>
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">No products match your search.</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          {selectedProduct ? (
            <>
              <p className="text-sm font-semibold text-slate-900">{selectedProduct.name}</p>
              <p className="mt-1 text-sm text-slate-500">{selectedProduct.category || 'Uncategorized'}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stock</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{availableQty}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unit price</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{selectedProduct.sellingPrice ? `Rs ${selectedProduct.sellingPrice}` : 'N/A'}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-100 p-6 text-center text-sm text-slate-500">
              Select a product to view stock, category, and pricing.
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <button
            type="button"
            onClick={onAddToCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add to cart
          </button>
          {selectedProduct ? (
            <p
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                remainingStock <= 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : remainingStock <= (selectedProduct.minStock || 10)
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {remainingStock <= 0
                ? 'Out of stock'
                : remainingStock <= (selectedProduct.minStock || 10)
                ? `Low stock — only ${remainingStock} left`
                : `Available stock: ${remainingStock}`}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
