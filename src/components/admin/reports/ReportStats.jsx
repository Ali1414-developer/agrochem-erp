import { ShoppingCart, BarChart3, Package2, Layers } from 'lucide-react'

export default function ReportStats({ stats }) {
  const tiles = [
    { label: 'Total sales', value: `Rs ${stats.totalRevenue.toLocaleString()}`, icon: ShoppingCart, tone: 'bg-emerald-600' },
    { label: 'Transactions', value: stats.totalTransactions.toLocaleString(), icon: BarChart3, tone: 'bg-sky-600' },
    { label: 'Products sold', value: stats.totalProductsSold.toLocaleString(), icon: Package2, tone: 'bg-emerald-600' },
    { label: 'Inventory items', value: stats.inventoryItems.toLocaleString(), icon: Layers, tone: 'bg-sky-600' },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25 transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{tile.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{tile.value}</p>
            </div>
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${tile.tone} text-white`}>
              <tile.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
