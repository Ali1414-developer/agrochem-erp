import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProductSearch from '../../components/admin/products/ProductSearch'
import ProductFilters from '../../components/admin/products/ProductFilters'
import ProductTable from '../../components/admin/products/ProductTable'
import ProductForm from '../../components/admin/products/ProductForm'
import ProductDetailsModal from '../../components/admin/products/ProductDetailsModal'
import DeleteProductModal from '../../components/admin/products/DeleteProductModal'
import AddToProductsModal from '../../components/admin/inventory/AddToProductsModal'
import { PlusCircle, Printer, Download } from 'lucide-react'
import { downloadProductsCatalogFile, printProductsCatalog } from '../../utils/exportProducts'

export default function ProductsPage() {
  const { appData, setAppData } = useAuth()
  const products = appData?.products || []
  const inventory = appData?.inventory || []
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
  const [importOpen, setImportOpen] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null)

  const unlistedInventoryItems = useMemo(() => {
    return inventory.filter(
      (inv) => !products.some((p) => p.id === inv.productId || p.name.toLowerCase() === (inv.productName || inv.name || '').toLowerCase()),
    )
  }, [inventory, products])

  const filtered = useMemo(() => {
    let out = [...products]
    if (query) out = out.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.sku || '').toLowerCase().includes(query.toLowerCase()))
    if (category) out = out.filter(p => p.category === category)
    if (status) {
      if (status === 'low') out = out.filter(p => Number(p.qty || 0) <= 10)
      if (status === 'out') out = out.filter(p => Number(p.qty || 0) === 0)
      if (status === 'sufficient') out = out.filter(p => Number(p.qty || 0) > 10)
    }
    if (sort) {
      if (sort === 'name') out.sort((a,b)=>a.name.localeCompare(b.name))
      if (sort === 'name_desc') out.sort((a,b)=>b.name.localeCompare(a.name))
      if (sort === 'price_asc') out.sort((a,b)=>(Number(a.sellingPrice||0)-Number(b.sellingPrice||0)))
      if (sort === 'price_desc') out.sort((a,b)=>(Number(b.sellingPrice||0)-Number(a.sellingPrice||0)))
      if (sort === 'qty_asc') out.sort((a,b)=>(Number(a.qty||0)-Number(b.qty||0)))
      if (sort === 'qty_desc') out.sort((a,b)=>(Number(b.qty||0)-Number(a.qty||0)))
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
      next.inventory = (next.inventory || []).map((inv) => {
        if (inv.productId === prod.id || (inv.productName && inv.productName.toLowerCase() === prod.name?.toLowerCase())) {
          return {
            ...inv,
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku || inv.sku,
            category: prod.category || inv.category,
            unit: prod.unit || inv.unit,
            qty: Number(prod.qty || 0),
            vendor: prod.vendor || inv.vendor,
            batchNumber: prod.batchNumber || inv.batchNumber,
            expiryDate: prod.expiryDate ?? inv.expiryDate,
          }
        }
        return inv
      })
      const hasInventoryLink = (next.inventory || []).some(
        (inv) => inv.productId === prod.id || (inv.productName && inv.productName.toLowerCase() === prod.name?.toLowerCase()),
      )
      if (!hasInventoryLink) {
        next.inventory = [
          {
            id: 'inv_' + Date.now(),
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku || '',
            category: prod.category || 'Uncategorized',
            unit: prod.unit || 'L',
            qty: Number(prod.qty || 0),
            vendor: prod.vendor || '',
            batchNumber: prod.batchNumber || '',
            expiryDate: prod.expiryDate || null,
            location: 'Warehouse A',
            warehouse: 'Warehouse A',
          },
          ...(next.inventory || []),
        ]
      }
    } else {
      const id = 'prod_' + Date.now()
      next.products = [{ ...prod, id }, ...(next.products || [])]
      next.inventory = [
        {
          id: 'inv_' + Date.now(),
          productId: id,
          productName: prod.name,
          sku: prod.sku || '',
          category: prod.category || 'Uncategorized',
          unit: prod.unit || 'L',
          qty: Number(prod.qty || 0),
          vendor: prod.vendor || '',
          batchNumber: prod.batchNumber || '',
          expiryDate: prod.expiryDate || null,
          location: 'Warehouse A',
          warehouse: 'Warehouse A',
        },
        ...(next.inventory || []),
      ]
    }

    setAppData(next)
    showMessage('success', prod.id ? 'Product updated successfully.' : 'Product added successfully.')
    setFormOpen(false)
    setEditing(null)
  }

  const handleSaveFromInventory = (productData) => {
    if (!productData || !productData.name) {
      showMessage('error', 'Unable to add product from inventory. Missing item details.')
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
    setImportOpen(false)
    setSelectedInventoryItem(null)
    showMessage('success', 'Stock added from total inventory into Products for sale!')
  }

  const handleDelete = (id) => {
    const next = { ...appData }
    const targetProd = (next.products || []).find((p) => p.id === id)
    next.products = (next.products || []).filter((p) => p.id !== id)
    setAppData(next)
    setConfirmDelete(null)
    showMessage('success', 'Product deleted successfully.')
  }

  const handleEdit = (p) => { setEditing(p); setFormOpen(true) }
  const handleView = (p) => setViewing(p)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Products for Sale</h2>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-nowrap sm:items-center">
          <button
            type="button"
            onClick={() => downloadProductsCatalogFile(filtered)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 shadow-xs whitespace-nowrap sm:w-auto"
            title="Download Full Products Catalog"
          >
            <Download size={16} /> Download Catalog
          </button>
          <button
            type="button"
            onClick={() => printProductsCatalog(filtered)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 shadow-xs whitespace-nowrap sm:w-auto"
            title="Print Full Products Catalog"
          >
            <Printer size={16} /> Print Catalog
          </button>
          {unlistedInventoryItems.length > 0 ? (
            <div className="relative w-full sm:w-auto">
              <select
                onChange={(e) => {
                  const selectedId = e.target.value
                  if (!selectedId) return
                  const found = inventory.find((i) => i.id === selectedId)
                  if (found) {
                    setSelectedInventoryItem(found)
                    setImportOpen(true)
                  }
                  e.target.value = ''
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer whitespace-nowrap sm:w-auto"
              >
                <option value="">+ Add from Inventory ({unlistedInventoryItems.length} available)</option>
                {unlistedInventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productName || item.name} ({item.qty} in warehouse)
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <button onClick={openAdd} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 whitespace-nowrap sm:w-auto">Add product</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 min-w-0 flex-col gap-4 lg:flex-row">
          <ProductSearch value={query} onSearch={setQuery} />
          <ProductFilters
            categories={categories}
            onCategoryChange={setCategory}
            categoryValue={category}
            onStatusChange={setStatus}
            statusValue={status}
            onSortChange={setSort}
            sortValue={sort}
          />
        </div>
      </div>

      {message ? (
        <div className={`rounded-3xl border px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <ProductTable items={filtered} onView={handleView} onEdit={handleEdit} onDelete={(p) => setConfirmDelete(p)} />
      </div>

      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        product={editing}
        categories={categories}
        onSave={saveProduct}
      />
      <ProductDetailsModal open={!!viewing} onClose={() => setViewing(null)} product={viewing} />
      <DeleteProductModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} product={confirmDelete} onConfirm={handleDelete} />
      <AddToProductsModal open={importOpen} inventoryItem={selectedInventoryItem} categories={categories} onClose={() => { setImportOpen(false); setSelectedInventoryItem(null) }} onSave={handleSaveFromInventory} />
    </div>
  )
}
