export function getCustomerKey(item) {
  if (!item) return ''
  if (item.id) return `id:${item.id}`
  const name = (item.name || '').trim().toLowerCase()
  const phone = (item.phone || '').trim()
  const email = (item.email || '').trim().toLowerCase()
  return `name:${name}|phone:${phone}|email:${email}`
}

export function mergeCustomers(customers = [], sales = []) {
  const map = new Map()

  const mergeCustomer = (customer) => {
    const key = getCustomerKey(customer)
    if (!key) return
    const existing = map.get(key)
    if (existing) {
      map.set(key, { ...existing, ...customer, orders: existing.orders || customer.orders || 0, totalPurchase: existing.totalPurchase || customer.totalPurchase || 0 })
    } else {
      map.set(key, { ...customer })
    }
  }

  customers.forEach(mergeCustomer)

  sales.forEach((sale) => {
    if (!sale.customerName) return
    const saleCustomer = {
      id: sale.customerId || null,
      name: sale.customerName,
      phone: sale.customerPhone || '',
      email: sale.customerEmail || '',
      address: sale.customerAddress || '',
      lastPurchase: sale.date || '',
      orders: 1,
      totalPurchase: Number(sale.total || sale.amount || 0),
    }

    const key = getCustomerKey(saleCustomer)
    if (!key) return

    const existing = map.get(key)
    if (existing) {
      map.set(key, {
        ...existing,
        ...saleCustomer,
        orders: (Number(existing.orders) || 0) + 1,
        totalPurchase: (Number(existing.totalPurchase) || 0) + Number(saleCustomer.totalPurchase || 0),
        lastPurchase: saleCustomer.lastPurchase || existing.lastPurchase,
      })
    } else {
      map.set(key, saleCustomer)
    }
  })

  return Array.from(map.values())
}
