import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2,
  User, Phone, CreditCard,
  Banknote, Package, Tag, AlertCircle, Receipt
} from 'lucide-react'

function createInvoiceNumber(prefix = 'INV') {
  return `${prefix}-${Date.now()}`
}

export default function AdminPOSPage() {
  const { appData, setAppData, currentUser } = useAuth()
  const products = appData.products || []
  const inventory = appData.inventory || []
  const customers = appData.customers || []
  const categories = appData.categories || []
  const posSettings = appData.settings?.pos || {}

  const [search, setSearch] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [cart, setCart] = useState([])
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successInvoice, setSuccessInvoice] = useState('')
  const [receiptSlip, setReceiptSlip] = useState(null)
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '', email: '' })
  const [paymentMethod, setPaymentMethod] = useState(posSettings.defaultPaymentMethod || 'Cash')
  const [paymentPlan, setPaymentPlan] = useState('Full')
  const [amountPaid, setAmountPaid] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')

  // Build categories list
  const categoryList = useMemo(() => {
    const names = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return ['All', ...names]
  }, [products])

  // Build active products directly from Products catalog
  const activeProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      availableQty: Number(product.qty || 0),
      sellingPrice: Number(product.sellingPrice || product.price || 0),
      batchNumber: product.batchNumber || '',
      expiryDate: product.expiryDate || '',
    }))
  }, [products])

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return activeProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term)
      const skuMatch = (product.sku || '').toLowerCase().includes(term)
      const categoryMatch = (product.category || '').toLowerCase().includes(term)
      const categorySelected = categoryFilter === 'All' || product.category === categoryFilter
      return (nameMatch || skuMatch || categoryMatch) && categorySelected
    })
  }, [activeProducts, search, categoryFilter])

  // Cart calculations
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart])
  const total = subtotal
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  // Change calculation for cash payment
  const changeReturn = useMemo(() => {
    const paid = Number(amountPaid || 0)
    return paid > total ? paid - total : 0
  }, [amountPaid, total])

  // Customer search suggestions
  const customerSuggestions = useMemo(() => {
    const term = customerSearch.trim().toLowerCase()
    if (!term) return []
    return customers.filter((item) =>
      item.name?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term)
    ).slice(0, 5)
  }, [customers, customerSearch])

  // Add product to cart directly (live right-side cart panel)
  const handleAddToCart = (product) => {
    if (product.availableQty <= 0) return

    setCart((current) => {
      const exists = current.find((item) => item.productId === product.id)
      if (exists) {
        return current.map((item) => {
          if (item.productId !== product.id) return item
          const nextQty = item.quantity + 1
          if (nextQty > product.availableQty) return item
          return {
            ...item,
            quantity: nextQty,
            totalPrice: nextQty * Number(product.sellingPrice || 0),
            availableQty: product.availableQty,
          }
        })
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          sku: product.sku,
          unitPrice: Number(product.sellingPrice || product.price || 0),
          quantity: 1,
          totalPrice: Number(product.sellingPrice || product.price || 0),
          availableQty: product.availableQty,
        },
      ]
    })
  }

  // Update cart item quantity
  const handleCartQuantityChange = (productId, nextQuantity) => {
    setCart((current) =>
      current.map((item) => {
        if (item.productId !== productId) return item
        const product = activeProducts.find((p) => p.id === productId)
        const available = product?.availableQty ?? 0
        if (nextQuantity < 1) nextQuantity = 1
        if (nextQuantity > available) return item
        return {
          ...item,
          quantity: nextQuantity,
          totalPrice: nextQuantity * Number(item.unitPrice),
          availableQty: available,
        }
      }),
    )
  }

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

  // Clear entire cart
  const handleClearCart = () => {
    setCart([])
  }

  // Select existing customer
  const handleSelectCustomer = (existing) => {
    setCustomer({
      id: existing.id,
      name: existing.name,
      address: existing.address || 'Over the counter',
      phone: existing.phone || '',
      email: existing.email || '',
    })
    setCustomerSearch('')
  }

  // Open small rectangular slip checkout modal
  const handleOpenPaySlip = () => {
    if (!cart.length) return
    setCheckoutError('')
    setPaymentPlan('Full')
    setPaymentMethod(posSettings.defaultPaymentMethod || 'Cash')
    setAmountPaid(String(total))
    setDueDate('')
    setDueTime('')
    setPaymentReference('')
    setInvoiceNumber('')
    setShowCheckoutModal(true)
  }

  const handleSelectPaymentPlan = (plan) => {
    setPaymentPlan(plan)
    if (plan === 'Full') {
      setAmountPaid(String(total))
    } else if (plan === 'Half') {
      setAmountPaid(String(Number((total / 2).toFixed(2))))
    } else {
      setAmountPaid('')
    }
    setDueDate('')
    setDueTime('')
    setPaymentReference('')
  }

  // Complete the sale from the receipt slip
  const completeSale = () => {
    // Validate
    if (!cart.length) {
      setCheckoutError('Cart is empty.')
      return
    }
    if (!customer.name.trim()) {
      setCheckoutError('Please enter Customer Name.')
      return
    }
    if (!customer.phone.trim()) {
      setCheckoutError('Please enter Customer Phone Number.')
      return
    }
    const cleanPhone = customer.phone.replace(/\D/g, '')
    if (cleanPhone.length !== 11) {
      setCheckoutError('Phone number must be exactly 11 digits (e.g. 03001234567).')
      return
    }

    const paid = Number(amountPaid || 0)
    if (Number.isNaN(paid) || paid < 0) {
      setCheckoutError('Amount paid must be a valid non-negative number.')
      return
    }

    const computedAmountPaid = paymentPlan === 'Full'
      ? Number(total)
      : paymentPlan === 'Half'
      ? Number((total / 2).toFixed(2))
      : paid

    const dueAmount = Number((total - computedAmountPaid).toFixed(2))
    if (paymentPlan === 'Full' && computedAmountPaid < total) {
      setCheckoutError('Full payment requires paying the full total amount.')
      return
    }
    if (paymentPlan === 'Other' && computedAmountPaid > total) {
      setCheckoutError('Amount paid cannot exceed the total amount.')
      return
    }
    if (dueAmount > 0 && (!dueDate.trim() || !dueTime.trim())) {
      setCheckoutError('Please enter a due date and time for the remaining payment.')
      return
    }

    setCheckoutError('')

    const now = new Date()
    const autoGenerateInvoice = posSettings.autoInvoiceNumber !== false
    const invoice = autoGenerateInvoice
      ? createInvoiceNumber(posSettings.invoicePrefix || 'INV')
      : invoiceNumber.trim()

    if (!invoice) {
      setCheckoutError('Please enter an invoice number.')
      return
    }

    const completedSlip = {
      invoice,
      customer: {
        ...customer,
        name: customer.name.trim() || 'Walk-in Customer',
        phone: customer.phone || 'N/A',
        address: customer.address || 'Over the counter',
      },
      cart: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
      subtotal,
      total,
      paymentMethod,
      paymentPlan,
      amountPaid: computedAmountPaid,
      dueAmount,
      dueDate: dueDate.trim() || null,
      dueTime: dueTime.trim() || null,
      paymentNote: paymentReference.trim() || '',
      paymentStatus: dueAmount > 0 ? 'Partial' : 'Paid',
      changeReturn,
    }

    // Update or create customer
    const customerPhoneTrimmed = (customer.phone || '').trim()
    const cleanName = (customer.name || '').trim().toLowerCase()

    const existingCustomer = customers.find((item) => {
      const phoneMatch = Boolean(customerPhoneTrimmed && item.phone && item.phone.trim() === customerPhoneTrimmed)
      const idMatch = Boolean(customer.id && item.id === customer.id)
      const nameMatch = Boolean(cleanName && cleanName !== 'walk-in customer' && item.name && item.name.trim().toLowerCase() === cleanName)
      return idMatch || (nameMatch && phoneMatch)
    })

    let targetCustomerId = ''
    let updatedCustomers = customers

    if (existingCustomer) {
      targetCustomerId = existingCustomer.id
      const updatedCustomer = {
        ...existingCustomer,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address || existingCustomer.address || 'Over the counter',
        email: customer.email || existingCustomer.email || '',
        lastPurchase: now.toLocaleString(),
        orders: (existingCustomer.orders || 0) + 1,
        totalPurchase: (existingCustomer.totalPurchase || 0) + total,
      }
      updatedCustomers = [updatedCustomer, ...customers.filter((c) => c.id !== updatedCustomer.id)]
    } else {
      const newCustomer = {
        id: `customer_${Date.now()}`,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address || 'Over the counter',
        email: customer.email || '',
        dateCreated: now.toLocaleDateString(),
        lastPurchase: now.toLocaleString(),
        orders: 1,
        totalPurchase: total,
      }
      targetCustomerId = newCustomer.id
      updatedCustomers = [newCustomer, ...customers]
    }

    // Reduce inventory quantities
    const updatedInventory = inventory.map((item) => {
      const cartItem = cart.find(
        (line) => line.productId === item.productId || (line.name && item.productName && line.name.toLowerCase() === item.productName.toLowerCase()),
      )
      if (!cartItem) return item
      const nextQty = Math.max(0, Number(item.qty || 0) - Number(cartItem.quantity || 0))
      return { ...item, qty: nextQty }
    })

    // Reduce product quantities
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find(
        (line) => line.productId === product.id || (line.name && product.name && line.name.toLowerCase() === product.name.toLowerCase()),
      )
      if (!cartItem) return product
      return { ...product, qty: Math.max(0, Number(product.qty || 0) - Number(cartItem.quantity || 0)) }
    })

    // Create sale record
    const saleRecord = {
      id: `sale_${Date.now()}`,
      invoice,
      description: `Sale to ${customer.name.trim()}`,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: targetCustomerId,
      customerName: customer.name.trim(),
      customerPhone: customer.phone.trim(),
      products: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        category: item.category,
        sku: item.sku,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.totalPrice,
      })),
      subtotal,
      total,
      paymentMethod,
      paymentPlan,
      amountPaid: computedAmountPaid,
      dueAmount,
      dueDate: dueDate.trim() || null,
      dueTime: dueTime.trim() || null,
      paymentNote: paymentReference.trim() || '',
      paymentStatus: dueAmount > 0 ? 'Partial' : 'Paid',
      changeReturn: changeReturn,
      createdBy: currentUser?.name || 'Cashier',
    }

    setAppData((prev) => ({
      ...prev,
      products: updatedProducts,
      inventory: updatedInventory,
      customers: updatedCustomers,
      sales: [saleRecord, ...(prev.sales || [])],
    }))

    setReceiptSlip(completedSlip)
    setSuccessInvoice(invoice)
    setShowCheckoutModal(false)
    setCart([])
    setCustomer({ name: '', address: '', phone: '', email: '' })
    setAmountPaid('')
    setShowSuccessModal(true)
  }

  const printReceiptSlip = () => {
    if (!receiptSlip) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const headContent = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n')

    const slipEl = document.getElementById('receipt-slip-for-print')
    const slipHtml = slipEl ? slipEl.outerHTML : `<pre>${JSON.stringify(receiptSlip, null, 2)}</pre>`

    printWindow.document.open()
    printWindow.document.write(`<!doctype html><html><head>${headContent}</head><body>${slipHtml}</body></html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  useEffect(() => {
    if (showSuccessModal && receiptSlip && appData.settings?.pos?.printReceipt) {
      const timer = window.setTimeout(() => {
        printReceiptSlip()
      }, 450)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [showSuccessModal, receiptSlip, appData.settings?.pos?.printReceipt])

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden">
      {/* ═══════════════════════════════════════════════════ */}
      {/* ── DESKTOP SOFTWARE HEADER BAR ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">POS Terminal Software</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500">Fast retail & trade point-of-sale register</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex flex-1 min-w-0 max-w-full items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name, SKU or barcode..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-1 min-w-0 items-center gap-1.5 overflow-x-auto pb-1 max-w-full lg:max-w-xl no-scrollbar">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── MAIN POS SOFTWARE SPLIT CONTAINER ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0 gap-4 overflow-hidden flex-col lg:flex-row">
        {/* ── LEFT: PRODUCT CARDS GRID ── */}
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product Catalog ({filteredProducts.length})
            </span>
            {categoryFilter !== 'All' && (
              <span className="text-xs font-medium text-emerald-600">Filtered by {categoryFilter}</span>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-base font-semibold text-slate-700">No products match your search</p>
                <p className="mt-1 text-xs text-slate-400">Try searching for a different product name or SKU</p>
              </div>
            ) : (
              <div className={`grid gap-4 transition-all ${cart.length > 0 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5'}`}>
                {filteredProducts.map((p) => {
                  const outOfStock = p.availableQty <= 0
                  const inCartItem = cart.find((c) => c.productId === p.id)
                  const countInCart = inCartItem?.quantity || 0

                  return (
                    <div
                      key={p.id}
                      onClick={() => !outOfStock && handleAddToCart(p)}
                      className={`group relative flex min-h-35 flex-col justify-between rounded-2xl border-2 p-5 transition-all duration-200 ${
                        outOfStock
                          ? 'border-slate-200 bg-slate-50/80 opacity-60 cursor-not-allowed shadow-xs'
                          : countInCart > 0
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-lg shadow-emerald-500/15 cursor-pointer ring-1 ring-emerald-500/20'
                          : 'border-slate-200/90 bg-white shadow-md shadow-slate-200/50 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer'
                      }`}
                    >
                      {/* Count badge if in cart */}
                      {countInCart > 0 && (
                        <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white shadow-md ring-2 ring-white">
                          {countInCart}
                        </span>
                      )}

                      <div className="flex flex-1 flex-col items-center text-center">
                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {p.name}
                        </h3>

                        <div className="mt-4 flex flex-col items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                            outOfStock
                              ? 'bg-rose-100 text-rose-700'
                              : p.availableQty <= (p.minStock || 10)
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          }`}>
                            {outOfStock
                              ? 'Out of stock'
                              : p.availableQty <= (p.minStock || 10)
                              ? `Low stock — ${p.availableQty} left`
                              : `Stock: ${p.availableQty}`}
                          </span>

                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(p)
                            }}
                            className={`flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-bold transition shadow-xs ${
                              outOfStock
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 cursor-pointer'
                            }`}
                          >
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: LIVE CART PANEL (APPEARS WHEN ANY PRODUCT IS ADDED) ── */}
        {cart.length > 0 && (
          <div className="flex w-full min-h-0 max-h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-right-4 lg:w-96">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Current Order</h2>
                <p className="text-[11px] text-slate-500">{cartCount} items in cart</p>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-700">Your Cart is Empty</p>
                <p className="mt-1 text-xs text-slate-400 max-w-50">
                  Click on any product card from the left panel to add it to your order.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">Rs {item.unitPrice.toLocaleString()} each</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-0.5">
                      <button
                        onClick={() => handleCartQuantityChange(item.productId, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleCartQuantityChange(item.productId, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-xs font-extrabold text-slate-900">
                      Rs {item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Pay Button */}
          <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-slate-900">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Fees</span>
                <span className="font-semibold text-slate-900">Rs 0</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total</span>
              <span className="text-lg font-extrabold text-white">Rs {total.toLocaleString()}</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleOpenPaySlip}
              className={`w-full rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-lg transition ${
                cart.length === 0
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 active:scale-[0.98] cursor-pointer'
              }`}
            >
              PAY NOW (Rs {total.toLocaleString()})
            </button>
          </div>
        </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── SMALL RECTANGULAR CHECKOUT RECEIPT SLIP MODAL ── */}
      {/* ═══════════════════════════════════════════════════ */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative flex max-h-[92vh] w-full max-w-full sm:max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 font-sans">
            
            {/* Slip Header Banner */}
            <div className="bg-emerald-700 px-6 py-4 text-white text-center relative">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute right-3 top-3 rounded-full p-1 text-white/80 hover:bg-white/20 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white mb-2">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wider">Checkout Slip</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Enter Customer Details to Process Order</p>
            </div>

            {/* Slip Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Invoice Preview Bar */}
              <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">
                <span>Total Amount: Rs {total.toLocaleString()}</span>
                <span className="text-slate-500">Items: {cartCount}</span>
              </div>
              {posSettings.autoInvoiceNumber === false && (
                <div className="grid gap-2 pt-3">
                  <label className="space-y-2 text-xs text-slate-600">
                    <span>Invoice number</span>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Enter invoice number"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none"
                    />
                  </label>
                </div>
              )}

              {/* Customer Details Form */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Customer Details</span>
                  <span className="text-[10px] text-rose-600 font-semibold">* Required</span>
                </div>

                {/* Quick Customer Search / Selector */}
                <div className="relative">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search existing customer..."
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  {customerSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg max-h-36 overflow-y-auto">
                      {customerSuggestions.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectCustomer(c)}
                          className="flex items-center justify-between px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg cursor-pointer transition"
                        >
                          <span className="font-semibold text-slate-900">{c.name}</span>
                          <span className="text-slate-500">{c.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Enter customer name..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Customer Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="11 digits (e.g. 03001234567)"
                      maxLength={11}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method & Cash Received */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Payment Method</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'Cash', icon: Banknote, label: 'Cash' },
                    { value: 'Card', icon: CreditCard, label: 'Card' },
                    { value: 'Online', icon: Tag, label: 'Online' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPaymentMethod(item.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition cursor-pointer ${
                        paymentMethod === item.value
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 block">Payment plan</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Full', 'Half', 'Other'].map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => handleSelectPaymentPlan(plan)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          paymentPlan === plan
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 grid gap-2">
                  <label className="text-[11px] font-semibold text-slate-600 block">Amount paid</label>
                  <input
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        setAmountPaid('')
                        return
                      }
                      const numeric = Number(value)
                      setAmountPaid(Number.isNaN(numeric) ? '' : String(Math.max(0, numeric)))
                    }}
                    placeholder={`Rs ${paymentPlan === 'Full' ? total : paymentPlan === 'Half' ? (total / 2).toFixed(2) : ''}`}
                    disabled={paymentPlan !== 'Other'}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {(paymentPlan === 'Other' || paymentPlan === 'Half') && (
                  <div className="grid gap-2 text-xs text-slate-700">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Due date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Due time</label>
                      <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Reference</label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Payment note or memo"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentPlan !== 'Other' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Remaining due</label>
                      <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900">
                        Rs {Math.max(0, total - Number(amountPaid || 0)).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Change return</label>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-emerald-700">
                        Rs {changeReturn.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items Brief */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Order Items</span>
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs text-slate-700">
                    <span className="truncate max-w-50">{item.name} × {item.quantity}</span>
                    <span className="font-semibold">Rs {item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Error Box */}
              {checkoutError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}
            </div>

            {/* Slip Action Buttons Footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-2">
              <button
                type="button"
                onClick={completeSale}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition active:scale-[0.98] cursor-pointer"
              >
                Complete Payment (Rs {total.toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── SUCCESS RECEIPT SLIP ── */}
      {/* ═══════════════════════════════════════════════════ */}
      {showSuccessModal && receiptSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div id="receipt-slip-for-print" className="w-full max-w-full overflow-hidden border border-slate-200 bg-white shadow-2xl lg:max-w-105">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{appData.settings?.general?.erpName || 'ERP COMPANY'}</p>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900">Sale Slip</h3>
              </div>
              <div className="rounded-md bg-emerald-50 px-2.5 py-2 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Invoice</p>
                <p className="text-sm font-extrabold text-slate-900">{receiptSlip.invoice}</p>
              </div>
            </div>

            <div className="grid gap-3 p-3">
              <div className="border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Customer Details</p>
                <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-900">Name:</span> {receiptSlip.customer.name}</p>
                  <p><span className="font-semibold text-slate-900">Phone:</span> {receiptSlip.customer.phone}</p>
                  <p><span className="font-semibold text-slate-900">Address:</span> {receiptSlip.customer.address}</p>
                </div>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Sale Summary</p>
                <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">Rs {receiptSlip.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment</span>
                    <span className="font-semibold text-slate-900">{receiptSlip.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment plan</span>
                    <span className="font-semibold text-slate-900">{receiptSlip.paymentPlan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="font-semibold text-slate-900">{receiptSlip.paymentStatus}</span>
                  </div>
                  {receiptSlip.dueAmount > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Due amount</span>
                        <span className="font-semibold text-rose-700">Rs {receiptSlip.dueAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Due date/time</span>
                        <span className="font-semibold text-slate-900">
                          {receiptSlip.dueDate || 'N/A'}{receiptSlip.dueTime ? ` ${receiptSlip.dueTime}` : ''}
                        </span>
                      </div>
                    </>
                  )}
                  {receiptSlip.paymentMethod === 'Cash' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Cash received</span>
                        <span className="font-semibold text-slate-900">Rs {receiptSlip.amountPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Return</span>
                        <span className="font-semibold text-emerald-700">Rs {receiptSlip.changeReturn.toLocaleString()}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-extrabold text-emerald-700">Rs {receiptSlip.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 pb-3">
              <div className="overflow-hidden border border-slate-200">
                <div className="grid grid-cols-[1.5fr_0.6fr_0.8fr] bg-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                <div className="divide-y divide-slate-200 bg-white">
                  {receiptSlip.cart.map((item) => (
                    <div key={item.productId} className="grid grid-cols-[1.5fr_0.6fr_0.8fr] items-center px-3 py-2 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="text-center">{item.quantity}</span>
                      <span className="text-right font-semibold text-slate-900">Rs {item.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-3 py-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={printReceiptSlip}
                  className="w-full rounded-md border border-slate-200 bg-white py-2.5 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-100 transition cursor-pointer"
                >
                  Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false)
                    setReceiptSlip(null)
                  }}
                  className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
                >
                  Back to POS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
