export function getLowStockThreshold(settings) {
  return Number(settings?.inventory?.lowStockThreshold ?? 10)
}

export function getInventoryProductMatch(inventoryItem, products = []) {
  return products.find(
    (product) => product.id === inventoryItem.productId || product.name === inventoryItem.productName,
  )
}

export function isLowStockInventoryItem(inventoryItem, products = [], settings = {}) {
  const threshold = getLowStockThreshold(settings)
  return Number(inventoryItem.qty || 0) < threshold
}

export function getLowStockProductCount(inventoryItems = [], products = [], settings = {}) {
  const lowStockProducts = inventoryItems
    .filter((item) => isLowStockInventoryItem(item, products, settings))
    .map((item) => item.productId || item.productName || '')
    .filter(Boolean)

  return new Set(lowStockProducts).size
}

export function getLowStockProducts(inventoryItems = [], products = [], settings = {}) {
  const threshold = getLowStockThreshold(settings)
  const productMap = {}

  inventoryItems.forEach((item) => {
    if (Number(item.qty || 0) >= threshold) return
    const key = item.productId || item.productName || ''
    if (!key) return

    const matchedProduct = products.find(
      (product) => product.id === item.productId || product.name === item.productName,
    )

    const currentQty = Number(item.qty || 0)
    const existing = productMap[key]

    productMap[key] = {
      id: matchedProduct?.id || key,
      name: matchedProduct?.name || item.productName || 'Unknown product',
      sku: matchedProduct?.sku || item.sku || '—',
      qty: existing ? Math.min(existing.qty, currentQty) : currentQty,
      threshold,
      product: matchedProduct,
    }
  })

  return Object.values(productMap)
}
