import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getLowStockThreshold } from '../../utils/stock'
import InventorySearch from '../../components/admin/inventory/InventorySearch'
import InventoryFilters from '../../components/admin/inventory/InventoryFilters'
import InventoryTable from '../../components/admin/inventory/InventoryTable'
import InventoryForm from '../../components/admin/inventory/InventoryForm'
import InventoryDetailsModal from '../../components/admin/inventory/InventoryDetailsModal'
import DeleteInventoryModal from '../../components/admin/inventory/DeleteInventoryModal'
import AddToProductsModal from '../../components/admin/inventory/AddToProductsModal'

import { Download, Printer } from 'lucide-react'
import { downloadInventoryFile, printInventoryCatalog } from '../../utils/exportInventory'

export default function Inventory() {
  const { appData, setAppData } = useAuth()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')

  const [selected, setSelected] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addToProductsOpen, setAddToProductsOpen] = useState(false)

  const products = appData.products || []
  const vendors = appData.vendors || []
  const pendingPurchaseOrders = appData.pendingPurchaseOrders || []
  const validVendorNames = useMemo(() =>
    Array.from(new Set((vendors.map((vendor) => vendor.name).filter(Boolean)))),
    [vendors],
  )
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))), [products])

  const inventoryItems = appData.inventory || []
  const lowStockThreshold = getLowStockThreshold(appData.settings)
  const expiryWarningDays = Number(appData.settings?.inventory?.expiryWarningDays ?? 30)

  const enrichedInventoryItems = useMemo(() => {
    return inventoryItems.map((item) => {
      const matchedProduct = products.find((product) =>
        product.id === item.productId ||
        product.name?.toLowerCase() === (item.productName || '').toLowerCase() ||
        product.sku?.toLowerCase() === (item.sku || '').toLowerCase(),
      )

      const normalizedVendor = validVendorNames.includes(item.vendor)
        ? item.vendor
        : validVendorNames.includes(matchedProduct?.vendor)
          ? matchedProduct.vendor
          : '—'

      return {
        ...item,
        productName: item.productName || matchedProduct?.name || 'Unknown product',
        sku: item.sku || matchedProduct?.sku || '—',
        category: item.category || item.productCategory || matchedProduct?.category || '—',
        unit: item.unit || matchedProduct?.unit || '—',
        vendor: normalizedVendor,
        batchNumber: item.batchNumber || matchedProduct?.batchNumber || '—',
        expiryDate: item.expiryDate || matchedProduct?.expiryDate || '—',
      }
    })
  }, [inventoryItems, products, validVendorNames])

  const filtered = useMemo(() => {
    let items = [...enrichedInventoryItems]

    if (query) {
      const q = query.toLowerCase()
      items = items.filter((it) => (it.productName || '').toLowerCase().includes(q) || (it.sku || '').toLowerCase().includes(q))
    }

    if (category) items = items.filter((it) => (it.category || it.productCategory || '').toLowerCase() === category.toLowerCase())

    if (status) {
      if (status === 'low') items = items.filter((it) => it.qty < lowStockThreshold && it.qty > 0)
      if (status === 'out') items = items.filter((it) => it.qty <= 0)
      if (status === 'sufficient') items = items.filter((it) => it.qty >= lowStockThreshold)
      if (status === 'near-expiry') items = items.filter((it) => {
        if (!it.expiryDate) return false
        const diff = (new Date(it.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= expiryWarningDays
      })
    }

    if (sort) {
      if (sort === 'name') items.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''))
      if (sort === 'name_desc') items.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''))
      if (sort === 'qty') items.sort((a, b) => a.qty - b.qty)
      if (sort === 'qty_desc') items.sort((a, b) => b.qty - a.qty)
      if (sort === 'expiry') items.sort((a, b) => new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0))
    }

    return items
  }, [enrichedInventoryItems, query, category, status, sort])

  const openDetails = (item) => { setSelected(item); setDetailsOpen(true) }
  const openEdit = (item) => { setSelected(item); setFormOpen(true) }
  const openDelete = (item) => { setSelected(item); setDeleteOpen(true) }
  const openAddToProducts = (item) => { setSelected(item); setAddToProductsOpen(true) }

  const handleSaveToProducts = (productData) => {
    if (!productData || !productData.name) {
      setAddToProductsOpen(false)
      return
    }

    setAppData((prev) => {
      const existingProds = prev.products || []
      const existingInvs = prev.inventory || []

      const transferQty = Number(productData.qty || 0)
      const normalizedProductName = (productData.name || '').toLowerCase()
      const existingProd = existingProds.find(
        (p) => p.id === productData.productId || (p.name || '').toLowerCase() === normalizedProductName,
      )

      let updatedProducts = []
      const prodId = existingProd ? existingProd.id : (productData.productId || `prod_${Date.now()}`)

      if (existingProd) {
        updatedProducts = existingProds.map((p) => {
          if (p.id === existingProd.id) {
            return {
              ...p,
              name: productData.name || p.name,
              sku: productData.sku || p.sku,
              category: productData.category || p.category,
              unit: productData.unit || p.unit,
              sellingPrice: productData.sellingPrice ? Number(productData.sellingPrice) : p.sellingPrice,
              purchasePrice: productData.purchasePrice ? Number(productData.purchasePrice) : p.purchasePrice,
              vendor: productData.vendor || p.vendor,
              qty: Number(p.qty || 0) + transferQty,
            }
          }
          return p
        })
      } else {
        const newProductObj = {
          id: prodId,
          name: productData.name,
          sku: productData.sku || '',
          category: productData.category || 'Uncategorized',
          description: productData.description || '',
          qty: transferQty,
          unit: productData.unit || 'L',
          purchasePrice: Number(productData.purchasePrice || 0),
          sellingPrice: Number(productData.sellingPrice || 0),
          vendor: productData.vendor || '',
          batchNumber: productData.batchNumber || '',
          expiryDate: productData.expiryDate || null,
          minStock: Number(productData.minStock || 10),
          status: 'active',
        }
        updatedProducts = [newProductObj, ...existingProds]
      }

      const updatedInventory = existingInvs.map((inv) => {
        if (inv.id === productData.inventoryId || inv.productName?.toLowerCase() === normalizedProductName) {
          const currentInvQty = Number(inv.qty || 0)
          return {
            ...inv,
            productId: prodId,
            productName: productData.name,
            sku: productData.sku || inv.sku,
            category: productData.category || inv.category,
            unit: productData.unit || inv.unit,
            vendor: productData.vendor || inv.vendor,
            qty: Math.max(0, currentInvQty - transferQty),
          }
        }
        return inv
      })

      return {
        ...prev,
        products: updatedProducts,
        inventory: updatedInventory,
      }
    })
    setAddToProductsOpen(false)
  }

  const saveItem = (updated) => {
    const normalizedVendor = validVendorNames.includes(updated.vendor)
      ? updated.vendor
      : ''

    setAppData((prev) => {
      let invList = [...(prev.inventory || [])]
      let prodList = [...(prev.products || [])]

      if (!updated.id) {
        const id = `i-${Date.now()}`
        const matchedProd = prodList.find(
          (p) => p.id === updated.productId || (updated.productName && p.name.toLowerCase() === updated.productName.toLowerCase()),
        )
        const productId = updated.productId || matchedProd?.id || null
        const newItem = {
          ...updated,
          id,
          productId,
          productName: updated.productName || matchedProd?.name || 'New Inventory Item',
          vendor: normalizedVendor,
        }

        if (matchedProd) {
          prodList = prodList.map((p) =>
            p.id === matchedProd.id
              ? {
                  ...p,
                  name: updated.productName || p.name,
                  batchNumber: updated.batchNumber || p.batchNumber,
                  expiryDate: updated.expiryDate ?? p.expiryDate,
                  vendor: normalizedVendor || p.vendor,
                  unit: updated.unit || p.unit,
                  category: updated.category || p.category,
                }
              : p,
          )
        }
        invList = [newItem, ...invList]
      } else {
        invList = invList.map((it) => (it.id === updated.id ? { ...it, ...updated, vendor: normalizedVendor } : it))
        const targetInv = invList.find((it) => it.id === updated.id)
        if (targetInv && targetInv.productId) {
          const targetProd = prodList.find(
            (p) => p.id === targetInv.productId || (targetInv.productName && p.name.toLowerCase() === targetInv.productName.toLowerCase()),
          )
          if (targetProd) {
            prodList = prodList.map((p) =>
              p.id === targetProd.id
                ? {
                    ...p,
                    name: updated.productName || p.name,
                    batchNumber: updated.batchNumber || p.batchNumber,
                    expiryDate: updated.expiryDate ?? p.expiryDate,
                    vendor: normalizedVendor || p.vendor,
                    unit: updated.unit || p.unit,
                    category: updated.category || p.category,
                    sku: updated.sku || p.sku,
                  }
                : p,
            )
          }
        }
      }

      return {
        ...prev,
        inventory: invList,
        products: prodList,
      }
    })
    setFormOpen(false)
  }

  const confirmDelete = (id) => {
    setAppData((prev) => {
      const invNext = (prev.inventory || []).filter((it) => it.id !== id)
      return {
        ...prev,
        inventory: invNext,
      }
    })
    setDeleteOpen(false)
  }

  const deliverPurchaseOrder = (orderId) => {
    setAppData((prev) => {
      const order = (prev.pendingPurchaseOrders || []).find((item) => item.id === orderId)
      if (!order) return prev

      const inventoryItem = (prev.inventory || []).find((item) => item.productId === order.productId)
      const inventoryNext = inventoryItem
        ? (prev.inventory || []).map((item) =>
            item.productId === order.productId
              ? {
                  ...item,
                  qty: Number(item.qty || 0) + Number(order.quantity),
                  batchNumber: order.batchNumber || item.batchNumber,
                  expiryDate: order.expiryDate || item.expiryDate,
                  vendor: order.vendorName || item.vendor,
                }
              : item,
          )
        : [
            {
              id: `inv_${Date.now()}`,
              productId: order.productId,
              productName: order.productName,
              qty: Number(order.quantity),
              warehouse: 'Main warehouse',
              batchNumber: order.batchNumber || '',
              expiryDate: order.expiryDate || '',
              location: 'Main warehouse',
              vendor: order.vendorName || '',
            },
            ...(prev.inventory || []),
          ]

      return {
        ...prev,
        inventory: inventoryNext,
        pendingPurchaseOrders: (prev.pendingPurchaseOrders || []).filter((item) => item.id !== orderId),
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Total System Inventory</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap sm:items-center">
            <button
              type="button"
              onClick={() => downloadInventoryFile(filtered)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 shadow-xs whitespace-nowrap sm:w-auto"
              title="Download Inventory Stock Report"
            >
              <Download size={16} /> Download Inventory
            </button>
            <button
              type="button"
              onClick={() => printInventoryCatalog(filtered)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 shadow-xs whitespace-nowrap sm:w-auto"
              title="Print Inventory Stock Report"
            >
              <Printer size={16} /> Print Inventory
            </button>
            <span className="inline-flex w-full items-center justify-center rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 whitespace-nowrap sm:w-auto">
              {inventoryItems.length} items
            </span>
            <button onClick={() => { setSelected(null); setFormOpen(true) }} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 whitespace-nowrap sm:w-auto">Add inventory</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72"><InventorySearch value={query} onChange={setQuery} /></div>
            <div className="w-full"><InventoryFilters categories={categories} onCategoryChange={setCategory} categoryValue={category} onStatusChange={setStatus} statusValue={status} onSortChange={setSort} sortValue={sort} /></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <InventoryTable
            items={filtered}
            onView={openDetails}
            onEdit={openEdit}
            onDelete={openDelete}
            onAddToProducts={openAddToProducts}
            lowStockThreshold={lowStockThreshold}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Upcoming inventory</h3>
            <p className="mt-1 text-sm text-slate-500">Confirmed vendor orders waiting to be received into inventory.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{pendingPurchaseOrders.length} pending</span>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:grid-cols-3 lg:grid-cols-6">
            <div>Vendor</div>
            <div>Product</div>
            <div>Qty</div>
            <div className="hidden lg:block">Batch</div>
            <div className="hidden lg:block">Expiry</div>
            <div className="text-right">Action</div>
          </div>

          {pendingPurchaseOrders.length === 0 ? (
            <div className="px-4 py-8 text-sm text-slate-500">No confirmed orders are waiting for delivery.</div>
          ) : (
            pendingPurchaseOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-2 gap-3 px-4 py-4 text-sm text-slate-700 sm:grid-cols-3 lg:grid-cols-6">
                <div className="font-semibold text-slate-900">{order.vendorName}</div>
                <div>{order.productName}</div>
                <div>{order.quantity}</div>
                <div className="hidden lg:block">{order.batchNumber || '—'}</div>
                <div className="hidden lg:block">{order.expiryDate || '—'}</div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => deliverPurchaseOrder(order.id)}
                    className="rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <InventoryDetailsModal open={detailsOpen} item={selected} onClose={() => setDetailsOpen(false)} />
      <InventoryForm open={formOpen} item={selected} products={products} vendors={vendors} onClose={() => setFormOpen(false)} onSave={saveItem} />
      <DeleteInventoryModal open={deleteOpen} item={selected} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
      <AddToProductsModal open={addToProductsOpen} inventoryItem={selected} categories={categories} onClose={() => setAddToProductsOpen(false)} onSave={handleSaveToProducts} />
    </div>
  )
}
