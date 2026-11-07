import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import VendorSearch from '../../components/admin/vendors/VendorSearch'
import VendorTable from '../../components/admin/vendors/VendorTable'
import VendorForm from '../../components/admin/vendors/VendorForm'
import VendorDetailsModal from '../../components/admin/vendors/VendorDetailsModal'
import PurchaseOrderModal from '../../components/admin/vendors/PurchaseOrderModal'
import ReceiveOrderModal from '../../components/admin/vendors/ReceiveOrderModal'

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
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [message, setMessage] = useState(null)

  const enrichedVendors = useMemo(() => {
    return vendors.map((vendor) => {
      const matchingProducts = vendor.suppliedProducts?.length
        ? vendor.suppliedProducts
        : products.filter((product) => product.vendor === vendor.name)

      return {
        ...vendor,
        suppliedProducts: matchingProducts,
      }
    })
  }, [vendors, products])

  const filteredVendors = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return enrichedVendors
    return enrichedVendors.filter((vendor) => {
      return (
        vendor.name.toLowerCase().includes(term) ||
        vendor.company.toLowerCase().includes(term) ||
        (vendor.phone || '').toLowerCase().includes(term) ||
        (vendor.email || '').toLowerCase().includes(term)
      )
    })
  }, [enrichedVendors, query])

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
    setVendorFormOpen(false)
    setEditingVendor(null)
    showMessage('success', `Vendor ${vendor.id ? 'updated' : 'added'} successfully.`)
  }

  const deleteVendor = (vendor) => {
    const confirmed = window.confirm(`Delete vendor ${vendor.name}? This cannot be undone.`)
    if (!confirmed) return
    setAppData((prev) => ({ ...prev, vendors: (prev.vendors || []).filter((item) => item.id !== vendor.id) }))
    setViewingVendor(null)
    showMessage('success', 'Vendor deleted successfully.')
  }

  const startPurchase = (vendor) => {
    setSelectedVendor(vendor)
    setPurchaseOpen(true)
  }

  const completePurchase = ({
    productId,
    quantity,
    purchasePrice,
    expectedDeliveryDate,
    vendorId,
    paymentMethod,
    paymentPlan,
    amountPaid,
    dueAmount,
    dueDate,
    dueTime,
    paymentStatus,
    createNewProduct,
    newProductName,
    newProductCategory,
    newProductUnit,
  }) => {
    setAppData((prev) => {
      const selectedVendor = (prev.vendors || []).find((vendor) => vendor.id === vendorId)
      let finalProductId = productId
      let finalProductName = ''

      if (createNewProduct) {
        // Generate a temporary ID for the new item — it will be added to inventory only on delivery
        finalProductId = `p_${Date.now()}`
        finalProductName = newProductName?.trim() || 'New product'
      } else {
        const selectedProduct = (prev.products || []).find((product) => product.id === productId)
        finalProductName = selectedProduct?.name || 'Unknown product'
      }

      const total = Number(quantity) * Number(purchasePrice)
      const purchaseEntry = {
        id: `purchase_${Date.now()}`,
        vendorId,
        vendorName: selectedVendor?.name || 'Unknown vendor',
        productId: finalProductId,
        productName: finalProductName,
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        total,
        paymentMethod: paymentMethod || 'Cash',
        paymentPlan: paymentPlan || 'Full',
        amountPaid: Number(amountPaid || 0),
        dueAmount: Number(dueAmount || 0),
        dueDate: dueDate || '',
        dueTime: dueTime || '',
        paymentStatus: paymentStatus || 'Paid',
        expectedDeliveryDate: expectedDeliveryDate || '',
        batchNumber: '',
        expiryDate: '',
        date: new Date().toLocaleDateString(),
        status: 'upcoming',
        // Store new product metadata so inventory entry has full details on delivery
        isNewProduct: Boolean(createNewProduct),
        newProductCategory: newProductCategory?.trim() || 'General',
        newProductUnit: newProductUnit?.trim() || 'PCS',
      }

      const nextVendors = (prev.vendors || []).map((vendor) => {
        if (vendor.id !== vendorId) return vendor
        return {
          ...vendor,
          suppliedProducts: [
            ...(vendor.suppliedProducts || []),
            {
              productId: finalProductId,
              name: finalProductName,
              qty: Number(quantity),
              purchasePrice: Number(purchasePrice),
              batchNumber: '',
              expiryDate: '',
            },
          ],
          purchaseHistory: [purchaseEntry, ...(vendor.purchaseHistory || [])],
        }
      })

      return {
        ...prev,
        pendingPurchaseOrders: [purchaseEntry, ...(prev.pendingPurchaseOrders || [])],
        vendors: nextVendors,
      }
    })

    showMessage('success', 'Purchase order created and placed in upcoming inventory.')
  }

  const openReceiveModal = (order) => {
    setSelectedOrder(order)
    setReceiveOpen(true)
  }

  const receivePurchaseOrder = ({ orderId, batchNumber, expiryDate, purchasePrice }) => {
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
                  batchNumber: batchNumber || item.batchNumber,
                  expiryDate: expiryDate || item.expiryDate,
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
              batchNumber: batchNumber || '',
              expiryDate: expiryDate || '',
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

    showMessage('success', 'Order received and inventory updated.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:w-auto">
            <VendorSearch query={query} onQuery={setQuery} />
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 w-full text-center lg:w-auto lg:text-left">
            {filteredVendors.length} vendors
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <VendorTable
          vendors={filteredVendors}
          products={products}
          onView={(vendor) => setViewingVendor(vendor)}
          onEdit={(vendor) => { setEditingVendor(vendor); setVendorFormOpen(true) }}
          onDelete={deleteVendor}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Upcoming inventory</h3>
            <p className="mt-1 text-sm text-slate-500">Confirmed vendor orders waiting to be received into inventory.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{pendingPurchaseOrders.length} pending</span>
        </div>

        <div className="mt-5 space-y-3">
          {pendingPurchaseOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              No confirmed orders are waiting for delivery.
            </div>
          ) : (
            pendingPurchaseOrders.map((order) => (
              <div key={order.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-7 md:items-center">
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vendor</p>
                  <p className="mt-1 font-semibold text-slate-900">{order.vendorName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Product</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.productName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Qty</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Delivery</p>
                  <p className="mt-1 text-sm text-slate-600">{order.expectedDeliveryDate || '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{order.paymentPlan || 'Full'} · {order.paymentStatus || 'Paid'}</p>
                  {Number(order.dueAmount || 0) > 0 ? (
                    <p className="text-xs text-rose-600">Due Rs {Number(order.dueAmount || 0).toLocaleString()}</p>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                  <p className="mt-1 text-sm font-semibold text-amber-700">Pending</p>
                </div>
                <div className="md:text-right">
                  <button
                    type="button"
                    onClick={() => openReceiveModal(order)}
                    className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            ))
          )}
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
        vendors={vendors}
        products={products}
        selectedVendor={selectedVendor}
        onClose={() => setPurchaseOpen(false)}
        onConfirm={completePurchase}
      />

      <ReceiveOrderModal
        open={receiveOpen}
        order={selectedOrder}
        onClose={() => { setReceiveOpen(false); setSelectedOrder(null) }}
        onConfirm={receivePurchaseOrder}
      />
    </div>
  )
}
