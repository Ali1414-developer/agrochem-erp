import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { ArrowRight, Boxes, CircleDollarSign, Package, Users, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getLowStockProducts } from '../../utils/stock'
import { mergeCustomers } from '../../utils/customers'

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`
}

export default function SalesDashboard() {
  const navigate = useNavigate()
  const { appData, currentUser } = useAuth()

  const products = appData?.products || []
  const inventory = appData?.inventory || []
  const customers = appData?.customers || []
  const sales = appData?.sales || []

  const allCustomers = useMemo(() => mergeCustomers(customers, sales), [customers, sales])

  const totalStock = useMemo(() => inventory.reduce((sum, item) => sum + Number(item.qty || 0), 0), [inventory])
  const lowStockProducts = useMemo(() => getLowStockProducts(inventory, products, appData.settings), [inventory, products, appData.settings])

  const totalSales = useMemo(() => {
    return sales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)
  }, [sales])

  const todaysSales = useMemo(() => {
    const today = new Date().toDateString()
    return sales.filter((sale) => new Date(sale.date || '').toDateString() === today)
  }, [sales])

  const todaysSalesAmount = useMemo(() => {
    return todaysSales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)
  }, [todaysSales])

  const recentSales = useMemo(() => {
    return [...sales].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5)
  }, [sales])

  const salesByDateData = useMemo(() => {
    const grouped = {}
    sales.forEach((sale) => {
      const date = sale.date || 'Unknown'
      const amount = Number(sale.total || sale.amount || 0)
      grouped[date] = (grouped[date] || 0) + amount
    })

    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 5)
      .map(([date, value]) => ({ name: date, value }))
  }, [sales])

  const lowStockChartData = useMemo(() => {
    return lowStockProducts.slice(0, 5).map((product) => ({
      name: product.name,
      qty: Number(product.qty || 0),
    }))
  }, [lowStockProducts])

  const recentCustomers = useMemo(() => {
    const latestByCustomer = {}
    sales.forEach((sale) => {
      const key = sale.customerId || sale.customerName || sale.customerPhone || sale.customerEmail || ''
      if (!key) return
      const saleDate = new Date(sale.date || '')
      if (isNaN(saleDate)) return
      if (!latestByCustomer[key] || saleDate > new Date(latestByCustomer[key].lastPurchase || '')) {
        latestByCustomer[key] = {
          ...sale,
          lastPurchase: sale.date,
        }
      }
    })

    return [...allCustomers]
      .map((customer) => {
        const key = customer.id || customer.name || customer.phone || customer.email || ''
        const latestSale = latestByCustomer[key]
        return {
          ...customer,
          lastPurchase: latestSale?.lastPurchase || customer.lastPurchase || 'No purchase yet',
        }
      })
      .sort((a, b) => new Date(b.lastPurchase || '') - new Date(a.lastPurchase || ''))
      .slice(0, 5)
  }, [allCustomers, sales])

  const quickActions = [
    { title: 'Start New Sale', desc: 'Open POS for a new order', path: '/sales/pos', icon: ShoppingBag },
    { title: 'View Products', desc: 'Browse the product catalog', path: '/sales/products', icon: Package },
    { title: 'View Inventory', desc: 'Check current stock levels', path: '/sales/inventory', icon: Boxes },
    { title: 'View Customers', desc: 'Manage customer leads', path: '/sales/customers', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => navigate('/sales/products')}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{products.length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/sales/inventory')}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Available Stock</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{totalStock}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/sales/customers')}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{allCustomers.length}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/sales/pos')}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed Sales</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{sales.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Quick Actions</h3>
              <p className="mt-1 text-sm text-slate-500">Jump directly into common sales tasks.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{action.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{action.desc}</p>
                  </div>
                  <div className="rounded-xl bg-white p-2 text-emerald-600">
                    <Icon className="h-4 w-4" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Sales Snapshot</h3>
              <p className="mt-1 text-sm text-slate-500">Today’s performance at a glance.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Today’s sales</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{formatCurrency(todaysSalesAmount)}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm text-sky-700">Total sales value</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{formatCurrency(totalSales)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Low Stock Products</h3>
              <p className="mt-1 text-sm text-slate-500">Items that need attention soon.</p>
            </div>
          </div>

          <div className="mt-5 flex h-70 w-full items-center justify-center">
            {lowStockChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lowStockChartData} margin={{ top: 8, right: 16, left: -12, bottom: 8 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <RechartsTooltip formatter={(value) => [value, 'Units left']} />
                  <Legend />
                  <Bar dataKey="qty" name="Units left" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No low stock products at the moment.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Recent Sales</h3>
              <p className="mt-1 text-sm text-slate-500">Latest completed transactions by sales value.</p>
            </div>
          </div>

          <div className="mt-5 flex h-70 w-full items-center justify-center">
            {salesByDateData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByDateData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={92}
                    paddingAngle={2}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {salesByDateData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={['#14b8a6', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Sales']} />
                  <Legend wrapperStyle={{ paddingTop: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No recent sales yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Recent Customers</h3>
            <p className="mt-1 text-sm text-slate-500">Latest customer profiles added to the ERP.</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white">
          <div className="space-y-3 p-4 sm:hidden">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div key={customer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.phone || '—'}</p>
                  <p className="mt-2 text-sm text-slate-600">{customer.lastPurchase || 'No purchase yet'}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">No customers yet.</div>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {recentCustomers.length > 0 ? (
                  recentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{customer.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{customer.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{customer.lastPurchase || 'No purchase yet'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">No customers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
