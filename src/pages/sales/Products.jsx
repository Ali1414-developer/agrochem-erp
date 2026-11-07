import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProductSearch from '../../components/admin/products/ProductSearch'
import ProductFilters from '../../components/admin/products/ProductFilters'
import ProductTable from '../../components/admin/products/ProductTable'
import ProductForm from '../../components/admin/products/ProductForm'
import ProductDetailsModal from '../../components/admin/products/ProductDetailsModal'
import DeleteProductModal from '../../components/admin/products/DeleteProductModal'

import { Printer, Download } from 'lucide-react'
import { downloadProductsCatalogFile, printProductsCatalog } from '../../utils/exportProducts'

export default function SalesProductsPage() {
  const { appData, setAppData } = useAuth()
  const products = appData?.products || []
  const categories = appData?.categories || []

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')
  const [message, setMessage] = useState(null)

  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(() => {
    let out = [...products]
    if (query) out = out.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.sku || '').toLowerCase().includes(query.toLowerCase()))
    if (category) out = out.filter((p) => p.category === category)
    if (status) {
      if (status === 'low') out = out.filter((p) => Number(p.qty || 0) <= 10)
      if (status === 'out') out = out.filter((p) => Number(p.qty || 0) === 0)
      if (status === 'sufficient') out = out.filter((p) => Number(p.qty || 0) > 10)
    }
    if (sort) {
      if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name))
      if (sort === 'name_desc') out.sort((a, b) => b.name.localeCompare(a.name))
      if (sort === 'price_asc') out.sort((a, b) => Number(a.sellingPrice || 0) - Number(b.sellingPrice || 0))
      if (sort === 'price_desc') out.sort((a, b) => Number(b.sellingPrice || 0) - Number(a.sellingPrice || 0))
      if (sort === 'qty_asc') out.sort((a, b) => Number(a.qty || 0) - Number(a.qty || 0))
      if (sort === 'qty_desc') out.sort((a, b) => Number(b.qty || 0) - Number(a.qty || 0))
    }
    return out
  }, [products, query, category, status, sort])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 3200)
  }

  const saveProduct = (prod) => {
    const next = { ...appData }
    if (prod.id) {
      next.products = (next.products || []).map((p) => (p.id === prod.id ? { ...p, ...prod } : p))
    }
    setAppData(next)
    showMessage('success', prod.id ? 'Product updated successfully.' : 'Product added successfully.')
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = (id) => {
    const next = { ...appData }
    next.products = (next.products || []).filter((p) => p.id !== id)
    setAppData(next)
    setConfirmDelete(null)
    showMessage('success', 'Product deleted successfully.')
  }

  const handleEdit = (p) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleView = (p) => setViewing(p)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Sales Products</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Products overview</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => downloadProductsCatalogFile(filtered)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 shadow-xs"
              title="Download Full Products Catalog"
            >
              <Download size={16} /> Download Catalog
            </button>
            <button
              type="button"
              onClick={() => printProductsCatalog(filtered)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 shadow-xs"
              title="Print Full Products Catalog"
            >
              <Printer size={16} /> Print Catalog
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 min-w-0 gap-4">
          <ProductSearch value={query} onSearch={setQuery} />
          <ProductFilters categories={categories} onCategoryChange={setCategory} categoryValue={category} onStatusChange={setStatus} statusValue={status} onSortChange={setSort} sortValue={sort} />
        </div>
      </div>

      {message ? (
        <div className={`rounded-3xl border px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      ) : null}

      <ProductTable items={filtered} onView={handleView} />
      <ProductDetailsModal open={!!viewing} onClose={() => setViewing(null)} product={viewing} />
    </div>
  )
}
