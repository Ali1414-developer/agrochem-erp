import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getLowStockThreshold } from '../../utils/stock'
import ReportStats from '../../components/admin/reports/ReportStats'
import SalesChart from '../../components/admin/reports/SalesChart'
import CategorySalesChart from '../../components/admin/reports/CategorySalesChart'
import TopProducts from '../../components/admin/reports/TopProducts'
import InventoryAnalytics from '../../components/admin/reports/InventoryAnalytics'
import ReportFilters from '../../components/admin/reports/ReportFilters'

function parseDate(value) {
  if (!value) return new Date('')
  if (value.includes('/')) {
    const [month, day, year] = value.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(value)
}

function getDateKey(dateObj) {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
}

export default function ReportsPage() {
  const { appData } = useAuth()
  const categories = appData.categories || []
  const products = appData.products || []
  const inventory = appData.inventory || []
  const sales = appData.sales || []

  const [filters, setFilters] = useState({ dateRange: '30', category: 'all', product: 'all' })

  const dateLimit = useMemo(() => {
    const days = Number(filters.dateRange)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)
  }, [filters.dateRange])

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = parseDate(sale.date)
      if (isNaN(saleDate)) return false
      if (saleDate < dateLimit) return false
      const saleProducts = Array.isArray(sale.products) ? sale.products : []
      if (filters.category !== 'all' && !saleProducts.some((item) => item.category === filters.category)) return false
      if (filters.product !== 'all' && !saleProducts.some((item) => item.productId === filters.product)) return false
      return true
    })
  }, [sales, dateLimit, filters.category, filters.product])

  const lowStockThreshold = getLowStockThreshold(appData.settings)

  const filteredInventory = useMemo(() => {
    return inventory.map((item) => {
      const product = products.find((product) => product.id === item.productId)
      return {
        ...item,
        category: product?.category || 'Uncategorized',
      }
    })
  }, [inventory, products])

  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)
    const totalTransactions = filteredSales.length
    const totalProductsSold = filteredSales.reduce((sum, sale) => {
      const saleProducts = Array.isArray(sale.products) ? sale.products : []
      return sum + saleProducts.reduce((sub, item) => sub + Number(item.quantity || 0), 0)
    }, 0)
    return {
      totalRevenue,
      totalTransactions,
      totalProductsSold,
      inventoryItems: inventory.length,
    }
  }, [filteredSales, inventory.length])

  const unitsByProduct = useMemo(() => {
    const map = {}
    filteredSales.forEach((sale) => {
      const saleProducts = Array.isArray(sale.products) ? sale.products : []
      saleProducts.forEach((item) => {
        if (filters.product !== 'all' && item.productId !== filters.product) return
        const product = products.find((product) => product.id === item.productId) || { name: item.name, category: item.category }
        map[item.productId] = map[item.productId] || { productId: item.productId, name: product.name, quantity: 0, revenue: 0 }
        map[item.productId].quantity += Number(item.quantity || 0)
        map[item.productId].revenue += Number(item.totalPrice || item.quantity * item.unitPrice || 0)
      })
    })
    return Object.values(map).sort((a, b) => b.quantity - a.quantity).slice(0, 6)
  }, [filteredSales, filters.product, products])

  const categoryRevenue = useMemo(() => {
    const map = {}
    filteredSales.forEach((sale) => {
      const saleProducts = Array.isArray(sale.products) ? sale.products : []
      saleProducts.forEach((item) => {
        const category = item.category || 'Uncategorized'
        if (filters.category !== 'all' && category !== filters.category) return
        map[category] = map[category] || { category, revenue: 0 }
        map[category].revenue += Number(item.totalPrice || item.quantity * item.unitPrice || 0)
      })
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [filteredSales, filters.category])

  const salesTrend = useMemo(() => {
    const map = {}
    filteredSales.forEach((sale) => {
      const saleDate = parseDate(sale.date)
      const key = getDateKey(saleDate)
      if (!map[key]) map[key] = { date: key, revenue: 0, units: 0 }
      map[key].revenue += Number(sale.total || sale.amount || 0)
      const saleProducts = Array.isArray(sale.products) ? sale.products : []
      map[key].units += saleProducts.reduce((sub, item) => sub + Number(item.quantity || 0), 0)
    })
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredSales])

  const lowStockItems = useMemo(() => filteredInventory.filter((item) => Number(item.qty || 0) < lowStockThreshold), [filteredInventory, lowStockThreshold])

  const nearExpiryBatches = useMemo(() => {
    const now = new Date()
    const threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 45)
    return inventory
      .map((item) => ({
        id: item.id,
        productName: item.productName,
        expiryDate: item.expiryDate,
        daysLeft: Math.max(0, Math.round((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))),
      }))
      .filter((item) => new Date(item.expiryDate) <= threshold)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }, [inventory])

  const customerActivity = useMemo(() => {
    const map = {}
    sales.forEach((sale) => {
      if (!sale.customerName) return
      map[sale.customerName] = map[sale.customerName] || { customerName: sale.customerName, orders: 0, revenue: 0 }
      map[sale.customerName].orders += 1
      map[sale.customerName].revenue += Number(sale.total || sale.amount || 0)
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6)
  }, [sales])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.20)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Reports & Analytics</p>
            <h1 className="text-3xl font-semibold text-slate-950">Admin performance dashboard</h1>
          </div>
        </div>
      </div>

      <ReportFilters categories={categories.map((cat) => cat.name)} products={products} filters={filters} onChange={setFilters} />

      <ReportStats stats={stats} />

      <div className="grid gap-6">
        <SalesChart data={salesTrend} />
      </div>

      <div className="grid gap-6">
        <CategorySalesChart data={categoryRevenue} />
      </div>

      <div className="grid gap-6">
        <TopProducts products={unitsByProduct} />
      </div>

      <div className="grid gap-6">
        <InventoryAnalytics lowStock={lowStockItems} nearExpiry={nearExpiryBatches} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Customer activity</p>
            <h2 className="text-xl font-semibold text-slate-950">Most active accounts</h2>
          </div>
        </div>
        {customerActivity.length ? (
            <div className="space-y-4">
            <div className="space-y-4 sm:hidden">
              {customerActivity.map((row) => (
                <div key={row.customerName} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{row.customerName}</p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span>Orders</span>
                      <span>{row.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue</span>
                      <span>Rs {row.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-4 uppercase tracking-[0.2em]">Customer</th>
                    <th className="px-4 py-4 uppercase tracking-[0.2em]">Orders</th>
                    <th className="px-4 py-4 uppercase tracking-[0.2em]">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {customerActivity.map((row) => (
                    <tr key={row.customerName} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-900">{row.customerName}</td>
                      <td className="px-4 py-4 text-slate-700">{row.orders}</td>
                      <td className="px-4 py-4 text-slate-900">Rs {row.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            No customer activity found for the selected date range.
          </div>
        )}
      </div>
    </div>
  )
}
