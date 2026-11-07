import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProductCatalog from '../../components/shared/pos/ProductCatalog'
import CartPanel from '../../components/shared/pos/CartPanel'
import CustomerPanel from '../../components/shared/pos/CustomerPanel'
import CheckoutPanel from '../../components/shared/pos/CheckoutPanel'
import InvoiceModal from '../../components/shared/pos/InvoiceModal'

function createInvoiceNumber() {
  return `INV-${Date.now()}`
}

export default function ManagerPOSPage() {
  const { appData, setAppData, currentUser } = useAuth()
  const products = appData.products || []
  const inventory = appData.inventory || []
  const customers = appData.customers || []
  const sales = appData.sales || []
  const categories = appData.categories || []

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '', email: '' })
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const activeProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      availableQty: Number(product.qty || 0),
      sellingPrice: Number(product.sellingPrice || product.price || 0),
      batchNumber: product.batchNumber || '',
      expiryDate: product.expiryDate || '',
    }))
  }, [products])

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart])
  const total = useMemo(() => subtotal, [subtotal])

  const selectedProductDetails = useMemo(
    () => activeProducts.find((item) => item.id === selectedProduct?.id) || null,
    [activeProducts, selectedProduct],
  )

  const showMessage = (type, text) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage({ type: '', text: '' }), 3200)
  }

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setQuantity(1)
    showMessage('', '')
  }

  const handleAddToCart = () => {
    if (!selectedProductDetails) {
      showMessage('error', 'Select a product before adding to cart.')
      return
    }
    if (quantity < 1) {
      showMessage('error', 'Quantity must be at least 1.')
      return
    }
    if (quantity > selectedProductDetails.availableQty) {
      showMessage('error', 'Insufficient stock for the selected quantity.')
      return
    }

    setCart((current) => {
      const exists = current.find((item) => item.productId === selectedProductDetails.id)
      if (exists) {
        return current.map((item) => {
          if (item.productId !== selectedProductDetails.id) return item
          const nextQty = item.quantity + quantity
          if (nextQty > selectedProductDetails.availableQty) {
            showMessage('error', 'Insufficient stock to add more of this product.')
            return item
          }
          return {
            ...item,
            quantity: nextQty,
            totalPrice: nextQty * Number(selectedProductDetails.sellingPrice || 0),
            availableQty: selectedProductDetails.availableQty,
          }
        })
      }
      return [
        ...current,
        {
          productId: selectedProductDetails.id,
          name: selectedProductDetails.name,
          category: selectedProductDetails.category,
          sku: selectedProductDetails.sku,
          unitPrice: Number(selectedProductDetails.sellingPrice || 0),
          quantity,
          totalPrice: Number(selectedProductDetails.sellingPrice || 0) * quantity,
          availableQty: selectedProductDetails.availableQty,
        },
      ]
    })
    showMessage('success', 'Product added to cart.')
  }

  const handleCartQuantityChange = (productId, nextQuantity) => {
    setCart((current) =>
      current.map((item) => {
        if (item.productId !== productId) return item
        const product = activeProducts.find((p) => p.id === productId)
        const available = product?.availableQty ?? 0
        if (nextQuantity < 1) nextQuantity = 1
        if (nextQuantity > available) {
          showMessage('error', `Only ${available} units available for ${item.name}.`)
          return item
        }
        return {
          ...item,
          quantity: nextQuantity,
          totalPrice: nextQuantity * Number(item.unitPrice),
          availableQty: available,
        }
      }),
    )
  }

  const handleRemoveItem = (productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

  const handleCustomerChange = (nextCustomer) => {
    setCustomer(nextCustomer)
    showMessage('', '')
  }

  const handleSelectCustomer = (existing) => {
    setCustomer({
      id: existing.id,
      name: existing.name,
      address: existing.address || '',
      phone: existing.phone || '',
      email: existing.email || '',
    })
    showMessage('', '')
  }

  const validateSale = () => {
    if (!cart.length) {
      showMessage('error', 'Add at least one product to the cart before checkout.')
      return false
    }
    if (!customer.name) {
      showMessage('error', 'Customer name is required.')
      return false
    }
    if (!customer.address) {
      showMessage('error', 'Customer address is required.')
      return false
    }
    if (!customer.phone) {
      showMessage('error', 'Customer phone is required.')
      return false
    }
    return true
  }

  const resetSale = () => {
    setSelectedProduct(null)
    setQuantity(1)
    setCart([])
    setCustomer({ name: '', address: '', phone: '', email: '' })
    setPaymentMethod('Cash')
    setInvoiceOpen(false)
    setInvoiceNumber('')
    setReceipt(null)
    setMessage({ type: '', text: '' })
  }

  const handleNewSale = () => {
    if (cart.length === 0) {
      resetSale()
      return
    }
    const confirmed = window.confirm('Clear the current sale and start a new sale?')
    if (confirmed) {
      resetSale()
    }
  }

  const openInvoice = () => {
    if (!validateSale()) return
    setInvoiceNumber(createInvoiceNumber())
    setInvoiceOpen(true)
  }

  const completeSale = () => {
    if (!validateSale()) return

    const now = new Date()
    const invoice = invoiceNumber || createInvoiceNumber()
    const receiptData = {
      invoice,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer,
      items: cart,
      subtotal,
      total,
      paymentMethod,
    }

    const cleanPhone = (customer.phone || '').trim()
    const cleanEmail = (customer.email || '').trim().toLowerCase()
    const cleanName = (customer.name || '').trim().toLowerCase()

    const existingCustomer = customers.find((item) => {
      const phoneMatch = Boolean(cleanPhone && item.phone && item.phone.trim() === cleanPhone)
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
        ...customer,
        lastPurchase: now.toLocaleString(),
        orders: (existingCustomer.orders || 0) + 1,
        totalPurchase: (existingCustomer.totalPurchase || 0) + total,
      }
      updatedCustomers = [updatedCustomer, ...customers.filter((c) => c.id !== updatedCustomer.id)]
    } else {
      const newCustomer = {
        id: `customer_${Date.now()}`,
        ...customer,
        dateCreated: now.toLocaleDateString(),
        lastPurchase: now.toLocaleString(),
        orders: 1,
        totalPurchase: total,
      }
      targetCustomerId = newCustomer.id
      updatedCustomers = [newCustomer, ...customers]
    }

    const updatedInventory = inventory.map((item) => {
      const cartItem = cart.find((line) => line.productId === item.productId)
      if (!cartItem) return item
      const nextQty = Math.max(0, Number(item.qty || 0) - Number(cartItem.quantity || 0))
      return { ...item, qty: nextQty }
    })

    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((line) => line.productId === product.id)
      if (!cartItem) return product
      return { ...product, qty: Math.max(0, Number(product.qty || 0) - Number(cartItem.quantity || 0)) }
    })

    const saleRecord = {
      id: `sale_${Date.now()}`,
      invoice,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: targetCustomerId,
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      products: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      tax: 0,
      total,
      paymentMethod,
      paymentStatus: 'Paid',
      createdBy: currentUser?.fullName || 'Salesman',
      userRole: currentUser?.role || 'salesman',
    }

    setAppData((prev) => ({
      ...prev,
      customers: updatedCustomers,
      inventory: updatedInventory,
      products: updatedProducts,
      sales: [saleRecord, ...(prev.sales || [])],
    }))

    setReceipt(receiptData)
    setInvoiceOpen(false)
    setInvoiceNumber('')
    setCart([])
    setSelectedProduct(null)
    setQuantity(1)
    setCustomer({ name: '', address: '', phone: '', email: '' })
    showMessage('success', `Order completed successfully. Invoice ${invoice} has been created.`)
  }

  return (
    <div className="space-y-6">
      {message.text ? (
        <div className={`rounded-3xl px-4 py-3 text-sm ${message.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6">
        <ProductCatalog
          products={activeProducts}
          categories={categories}
          selectedProduct={selectedProductDetails}
          onSelectProduct={handleSelectProduct}
          onQuantityChange={setQuantity}
          quantity={quantity}
          onAddToCart={handleAddToCart}
        />

        <CartPanel
          cartItems={cart}
          onQuantityChange={handleCartQuantityChange}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCart([])}
        />

        <div className="space-y-6">
          <CustomerPanel
            customers={customers}
            customer={customer}
            onCustomerChange={handleCustomerChange}
            onSelectCustomer={handleSelectCustomer}
          />
          <CheckoutPanel
            subtotal={subtotal}
            total={total}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onOpenInvoice={openInvoice}
            disabled={!cart.length || !customer.name || !customer.address || !customer.phone}
          />
        </div>
      </div>

      <InvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        onConfirm={completeSale}
        invoice={invoiceNumber}
        customer={customer}
        cartItems={cart}
        subtotal={subtotal}
        total={total}
        paymentMethod={paymentMethod}
      />
    </div>
  )
}
