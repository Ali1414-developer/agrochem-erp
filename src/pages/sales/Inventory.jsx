import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getLowStockThreshold } from '../../utils/stock'
import InventorySearch from '../../components/admin/inventory/InventorySearch'
import InventoryFilters from '../../components/admin/inventory/InventoryFilters'
import InventoryTable from '../../components/admin/inventory/InventoryTable'
import InventoryDetailsModal from '../../components/admin/inventory/InventoryDetailsModal'

import { Download, Printer } from 'lucide-react'
import { downloadInventoryFile, printInventoryCatalog } from '../../utils/exportInventory'

export default function Inventory() {
  const { appData } = useAuth()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')
  const [selected, setSelected] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const products = appData?.products || []
  const inventoryItems = appData?.inventory || []
  const lowStockThreshold = getLowStockThreshold(appData.settings)
  const expiryWarningDays = Number(appData.settings?.inventory?.expiryWarningDays ?? 30)
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category).filter(Boolean))), [products])

  const filtered = useMemo(() => {
    let items = [...inventoryItems]

    if (query) {
      const q = query.toLowerCase()
      items = items.filter((item) => {
        const productName = (item.productName || '').toLowerCase()
        const sku = (item.sku || '').toLowerCase()
        const category = (item.category || '').toLowerCase()
        return productName.includes(q) || sku.includes(q) || category.includes(q)
      })
    }

    if (category) {
      items = items.filter((item) => (item.category || '').toLowerCase() === category.toLowerCase())
    }

    if (status) {
      if (status === 'low') items = items.filter((item) => Number(item.qty || 0) > 0 && Number(item.qty || 0) < lowStockThreshold)
      if (status === 'out') items = items.filter((item) => Number(item.qty || 0) <= 0)
      if (status === 'sufficient') items = items.filter((item) => Number(item.qty || 0) >= lowStockThreshold)
      if (status === 'near-expiry') {
        items = items.filter((item) => {
          if (!item.expiryDate) return false
          const diff = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
          return diff >= 0 && diff <= expiryWarningDays
        })
      }
    }

    if (sort) {
      if (sort === 'name') items.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''))
      if (sort === 'name_desc') items.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''))
      if (sort === 'qty') items.sort((a, b) => Number(a.qty || 0) - Number(b.qty || 0))
      if (sort === 'qty_desc') items.sort((a, b) => Number(b.qty || 0) - Number(a.qty || 0))
      if (sort === 'expiry') items.sort((a, b) => new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0))
    }

    return items
  }, [inventoryItems, query, category, status, sort])

  const openDetails = (item) => {
    setSelected(item)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Sales Inventory</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 flex items-center gap-2">
              Inventory overview <span className="text-xs font-normal text-slate-400">(Read-only view)</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => downloadInventoryFile(filtered)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 shadow-xs whitespace-nowrap"
              title="Download Inventory Stock Report"
            >
              <Download size={16} /> Download Inventory
            </button>
            <button
              type="button"
              onClick={() => printInventoryCatalog(filtered)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 shadow-xs whitespace-nowrap"
              title="Print Inventory Stock Report"
            >
              <Printer size={16} /> Print Inventory
            </button>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 whitespace-nowrap">
              {inventoryItems.length} items
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-72">
              <InventorySearch value={query} onChange={setQuery} placeholder="Search by product name, SKU, or category" />
            </div>
            <InventoryFilters categories={categories} onCategoryChange={setCategory} categoryValue={category} onStatusChange={setStatus} statusValue={status} onSortChange={setSort} sortValue={sort} />
          </div>
        </div>

        <InventoryTable items={filtered} onView={openDetails} />
      </div>

      <InventoryDetailsModal open={detailsOpen} item={selected} onClose={() => setDetailsOpen(false)} />
    </div>
  )
}
