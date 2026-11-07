import { Plus, ShoppingBag, Tag, Truck, Box, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminHeader from '../../components/admin/AdminHeader'
import StatCard from '../../components/admin/dashboard/StatCard'
import InventoryChart from '../../components/admin/dashboard/InventoryChart'
import CategoryPieChart from '../../components/admin/dashboard/CategoryPieChart'
import LowStockChart from '../../components/admin/dashboard/LowStockChart'
import ExpiryChart from '../../components/admin/dashboard/ExpiryChart'
import RecentTransactions from '../../components/admin/dashboard/RecentTransactions'
import SalesChart from '../../components/admin/reports/SalesChart'
import { getLowStockProductCount, getLowStockProducts } from '../../utils/stock'
import { mergeCustomers } from '../../utils/customers'

export default function AdminDashboard() {
  const { appData } = useAuth()
  const navigate = useNavigate()

  const products = appData?.products || []
  const inventoryItems = appData?.inventory || []
  const customers = appData?.customers || []
  const vendors = appData?.vendors || []
  const sales = appData?.sales || []
  const batches = appData?.batches || []

  const transactions = sales
  const productRecords = products
  const inventoryRecords = inventoryItems
  const customerRecords = mergeCustomers(customers, sales)
  const vendorRecords = vendors

  // parse date strings (supports MM/DD/YYYY and ISO)
  const parseDateSafe = (value) => {
    if (!value) return new Date('')
    if (typeof value !== 'string') return new Date(value)
    if (value.includes('/')) {
      const [month, day, year] = value.split('/').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date(value)
  }

  // Use the same 30-day default window as Reports so dashboard totals match
  const now = new Date()
  const dateLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
  const recentSales = transactions.filter((item) => {
    const d = parseDateSafe(item.date)
    return !isNaN(d) && d >= dateLimit
  })

  const totalRevenue = recentSales.reduce((sum, item) => sum + Number(item.total || item.amount || 0), 0)
  const totalSales = recentSales.length
  const averageSale = totalSales ? Math.round(totalRevenue / totalSales) : 0
  const inventoryValue = productRecords.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.purchasePrice || 0), 0)
  const lowStockCount = getLowStockProductCount(inventoryRecords, productRecords, appData.settings)
  const lowStockProducts = getLowStockProducts(inventoryRecords, productRecords, appData.settings)

  const nearExpiryBatches = inventoryRecords.filter((item) => {
    if (!item.expiryDate) return false
    const diff = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 45
  })

  const largestSale = recentSales.length
    ? recentSales.reduce((max, item) => Math.max(max, Number(item.total || item.amount || 0)), 0)
    : 0

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const revenueThisMonth = transactions
    .filter((item) => {
      const date = parseDateSafe(item.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, item) => sum + Number(item.total || item.amount || 0), 0)

  const revenueLastMonth = transactions
    .filter((item) => {
      const date = parseDateSafe(item.date)
      const month = date.getMonth()
      const year = date.getFullYear()
      return month === currentMonth - 1 || (currentMonth === 0 && month === 11 && year === currentYear - 1)
    })
    .reduce((sum, item) => sum + Number(item.total || item.amount || 0), 0)

  const rawGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0
  const growthPercent = transactions.length ? (rawGrowth || 100) : 100

  const salesSummary = {
    totalRevenue,
    totalSales,
    averageSale,
    largestSale,
    growthPercent,
    inventoryValue,
    lowStockCount,
    expiryCount: nearExpiryBatches.length,
    revenueThisMonth,
    revenueChange: revenueThisMonth - revenueLastMonth,
    purchaseCount: transactions.filter((item) => item.description?.toLowerCase().includes('purchase')).length,
  }

  const salesTrend = transactions.reduce((trendMap, sale) => {
    const date = parseDateSafe(sale.date)
    if (isNaN(date)) return trendMap
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    if (!trendMap[dateKey]) {
      trendMap[dateKey] = { date: dateKey, revenue: 0, units: 0 }
    }
    trendMap[dateKey].revenue += Number(sale.total || sale.amount || 0)
    const saleProducts = Array.isArray(sale.products) ? sale.products : []
    trendMap[dateKey].units += saleProducts.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    return trendMap
  }, {})

  const salesTrendData = Object.values(salesTrend).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="space-y-4">
      <AdminHeader title="Dashboard" />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Products"
          value={productRecords.length}
          icon={Tag}
          highlight="bg-emerald-600"
          onClick={() => navigate('/admin/products')}
          className="bg-linear-to-br from-white via-emerald-50/40 to-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.48)]"
        />
        <StatCard
          label="Inventory items"
          value={inventoryRecords.length}
          icon={Box}
          highlight="bg-emerald-600"
          onClick={() => navigate('/admin/inventory')}
          className="bg-linear-to-br from-white via-emerald-50/40 to-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.48)]"
        />
        <StatCard
          label="Customers"
          value={customerRecords.length}
          icon={Users}
          highlight="bg-emerald-600"
          onClick={() => navigate('/admin/customers')}
          className="bg-linear-to-br from-white via-emerald-50/40 to-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.48)]"
        />
        <StatCard
          label="Vendors"
          value={vendorRecords.length}
          icon={Truck}
          highlight="bg-emerald-600"
          onClick={() => navigate('/admin/vendors')}
          className="bg-linear-to-br from-white via-emerald-50/40 to-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.48)]"
        />
      </section>

      <section className="grid gap-3">
        <div className="mx-auto w-full max-w-full lg:max-w-5xl">
          <SalesChart data={salesTrendData} />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <LowStockChart lowStockItems={lowStockProducts} />
        <ExpiryChart nearExpiryBatches={nearExpiryBatches} />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <InventoryChart inventoryItems={inventoryRecords} />
        <CategoryPieChart categories={appData.categories || []} products={productRecords} />
      </section>

      <section className="grid gap-4">
        <RecentTransactions transactions={sales} />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <button
          type="button"
          onClick={() => navigate('/admin/inventory')}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Manage Inventory
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Tag className="h-4 w-4" /> Manage Products
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/customers')}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Users className="h-4 w-4" /> Manage Customers
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Users className="h-4 w-4" /> Manage Users
        </button>
      </section>
    </div>
  )
}
