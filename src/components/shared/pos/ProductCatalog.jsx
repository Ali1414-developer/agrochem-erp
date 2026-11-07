import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function ProductCatalog({ products = [], categories = [], selectedProduct, onSelectProduct, onQuantityChange, quantity, onAddToCart }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [onlyInStock, setOnlyInStock] = useState(true)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term)
      const skuMatch = (product.sku || '').toLowerCase().includes(term)
      const categoryMatch = product.category?.toLowerCase().includes(term)
      const categorySelected = categoryFilter === 'All' || product.category === categoryFilter
      const stockMatch = !onlyInStock || product.availableQty > 0
      return (nameMatch || skuMatch || categoryMatch) && categorySelected && stockMatch
    })
  }, [products, search, categoryFilter, onlyInStock])

  return (
    <div className="space-y-5 rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-emerald-50/50 p-6 shadow-2xl">
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Product catalog</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlyInStock((prev) => !prev)}
              className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${onlyInStock ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {onlyInStock ? 'In stock only' : 'Show all products'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_auto]">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or category"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
            <Search size={18} />
          </div>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No products available.
            <div className="mt-2 text-slate-400">Add products from the Products module to start selling.</div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((product) => {
              const isSelected = selectedProduct?.id === product.id
              const outOfStock = product.availableQty <= 0
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className={`group relative flex min-h-[140px] flex-col justify-between rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer ${
                    outOfStock
                      ? 'border-slate-200 bg-slate-50/80 opacity-60 cursor-not-allowed shadow-xs'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-lg ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90 bg-white shadow-md shadow-slate-200/50 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                        outOfStock
                          ? 'bg-rose-100 text-rose-700'
                          : product.availableQty <= (product.minStock || 10)
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      }`}
                    >
                      {outOfStock
                        ? 'Out of stock'
                        : product.availableQty <= (product.minStock || 10)
                        ? `Low stock — ${product.availableQty} left`
                        : `Stock: ${product.availableQty}`}
                    </span>

                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(product)
                      }}
                      className={`flex h-9 items-center gap-1 rounded-xl px-3.5 text-xs font-bold transition shadow-xs ${
                        outOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 cursor-pointer'
                      }`}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedProduct ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Selected product</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{selectedProduct.name}</p>
              <p className="text-sm text-slate-500">{selectedProduct.category || 'Uncategorized'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Unit price</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">Rs {selectedProduct.sellingPrice?.toFixed(2) ?? '0.00'}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Available stock</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{selectedProduct.availableQty}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Batch / expiry</p>
              <p className="mt-2 text-sm text-slate-700">{selectedProduct.batchNumber || 'N/A'} / {selectedProduct.expiryDate || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <label className="block text-sm font-semibold text-slate-700">Quantity</label>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="rounded-3xl bg-slate-100 px-4 py-3 text-slate-700 transition hover:bg-slate-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={selectedProduct.availableQty}
                  value={quantity}
                  onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.min(selectedProduct.availableQty, quantity + 1))}
                  className="rounded-3xl bg-slate-100 px-4 py-3 text-slate-700 transition hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onAddToCart}
              disabled={selectedProduct.availableQty <= 0}
              className={`rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 ${selectedProduct.availableQty <= 0 ? 'cursor-not-allowed bg-slate-200 text-slate-500 hover:bg-slate-200' : ''}`}
            >
              Add to cart
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
