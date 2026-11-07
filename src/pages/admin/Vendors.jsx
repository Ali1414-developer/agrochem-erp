import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import VendorSearch from '../../components/admin/vendors/VendorSearch'
import VendorTable from '../../components/admin/vendors/VendorTable'
import VendorForm from '../../components/admin/vendors/VendorForm'
import VendorDetailsModal from '../../components/admin/vendors/VendorDetailsModal'
import PurchaseOrderModal from '../../components/admin/vendors/PurchaseOrderModal'

export default function VendorsPage() {
  const { appData, setAppData } = useAuth()
  const vendors = appData.vendors || []
  const products = appData.products || []
  const inventory = appData.inventory || []
  const pendingPurchaseOrders = appData.pendingPurchaseOrders || []

  const [query, setQuery] = useState('')
  const [editingVendor, setEditingVendor] = useState(null)
  const [viewingVendor, setViewingVendor] = useState(null)
  const [vendorFormOpen, setVendorFormOpen] = useState(false)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [message, setMessage] = useState(null)

  const filteredVendors = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return vendors
    return vendors.filter((vendor) => {
      return (
        vendor.name.toLowerCase().includes(term) ||
        vendor.company.toLowerCase().includes(term) ||
        (vendor.phone || '').toLowerCase().includes(term) ||
        (vendor.email || '').toLowerCase().includes(term)
      )
    })
  }, [vendors, query])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 3200)
  }

  const saveVendor = (vendor) => {
    setAppData((prev) => {
      const existing = (prev.vendors || []).find((item) => item.id === vendor.id)
      const nextVendors = existing
        ? prev.vendors.map((item) => (item.id === vendor.id ? { ...item, ...vendor } : item))
        : [vendor, ...(prev.vendors || [])]
      return { ...prev, vendors: nextVendors }
    })
    showMessage('success', `Vendor ${vendor.id ? 'updated' : 'added'} successfully.`)
  }

  const deleteVendor = (vendor) => {
    const confirmed = window.confirm(`Delete vendor ${vendor.name}? This cannot be undone.`)
    if (!confirmed) return
    setAppData((prev) => ({ ...prev, vendors: (prev.vendors || []).filter((item) => item.id !== vendor.id) }))
    showMessage('success', 'Vendor deleted successfully.')
  }

  const startPurchase = (vendor) => {
    setSelectedVendor(vendor)
    setPurchaseOpen(true)
  }

  const completePurchase = ({ productId, quantity, purchasePrice, batchNumber, expiryDate, vendorId }) => {
    setAppData((prev) => {
      const productsNext = (prev.products || []).map((product) => {
        if (product.id !== productId) return product
        return {
          ...product,
          qty: Number(product.qty || 0) + Number(quantity),
          purchasePrice: Number(purchasePrice),
          batchNumber: batchNumber || product.batchNumber,
          expiryDate: expiryDate || product.expiryDate,
        }
      })

      const inventoryItem = (prev.inventory || []).find((item) => item.productId === productId)
      const inventoryNext = inventoryItem
        ? (prev.inventory || []).map((item) =>
            item.productId === productId
              ? { ...item, qty: Number(item.qty || 0) + Number(quantity), batchNumber: batchNumber || item.batchNumber, expiryDate: expiryDate || item.expiryDate }
              : item,
          )
        : [
            {
              id: `inv_${Date.now()}`,
              productId,
              productName: (products.find((p) => p.id === productId) || {}).name || 'Unknown product',
              qty: Number(quantity),
              warehouse: 'Main warehouse',
              batchNumber: batchNumber || '',
              expiryDate: expiryDate || '',
              location: 'Main warehouse',
            },
            ...(prev.inventory || []),
          ]

      const purchaseEntry = {
        id: `purchase_${Date.now()}`,
        vendorId,
        productId,
        quantity,
        purchasePrice,
        batchNumber,
        expiryDate,
        date: new Date().toLocaleDateString(),
      }

      const nextVendors = (prev.vendors || []).map((vendor) => {
        if (vendor.id !== vendorId) return vendor
        return {
          ...vendor,
          suppliedProducts: [
            ...(vendor.suppliedProducts || []),
            {
              productId,
              name: (products.find((p) => p.id === productId) || {}).name || 'Unknown product',
              qty: Number(quantity),
              purchasePrice,
              batchNumber,
              expiryDate,
            },
          ],
          purchaseHistory: [purchaseEntry, ...(vendor.purchaseHistory || [])],
        }
      })

      return {
        ...prev,
        products: productsNext,
        inventory: inventoryNext,
        vendors: nextVendors,
      }
    })

    showMessage('success', 'Purchase order confirmed and inventory updated.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Vendors</h2>
            <p className="mt-2 text-sm text-slate-500">Manage supplier records, orders, and inventory replenishment.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!vendors.length) {
                  showMessage('error', 'Create a vendor before placing an order.')
                  return
                }
                setSelectedVendor(vendors[0])
                setPurchaseOpen(true)
              }}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start purchase order
            </button>
            <button
              type="button"
              onClick={() => { setEditingVendor(null); setVendorFormOpen(true) }}
              className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Add vendor
            </button>
          </div>
        </div>
      </div>

      {message ? (
        <div className={`rounded-3xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <VendorSearch query={query} onQuery={setQuery} />
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{filteredVendors.length} vendors</div>
        </div>
      </div>

      <VendorTable
        vendors={filteredVendors}
        onView={(vendor) => setViewingVendor(vendor)}
        onEdit={(vendor) => { setEditingVendor(vendor); setVendorFormOpen(true) }}
        onDelete={deleteVendor}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Product purchase order</h3>
              <p className="mt-1 text-sm text-slate-500">Choose a vendor and record inbound stock.</p>
            </div>
            <div />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Products tracked</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inventory count</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{inventory.reduce((sum, item) => sum + Number(item.qty || 0), 0)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vendors</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{vendors.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent orders</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{vendors.reduce((count, vendor) => count + (vendor.purchaseHistory?.length || 0), 0) + pendingPurchaseOrders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <VendorForm
        open={vendorFormOpen}
        vendor={editingVendor}
        onClose={() => { setVendorFormOpen(false); setEditingVendor(null) }}
        onSave={saveVendor}
      />

      <VendorDetailsModal open={!!viewingVendor} vendor={viewingVendor} onClose={() => setViewingVendor(null)} />

      <PurchaseOrderModal
        open={purchaseOpen}
        vendor={selectedVendor}
        products={products}
        onClose={() => setPurchaseOpen(false)}
        onConfirm={completePurchase}
      />
    </div>
  )
}
