import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'

export default function InventoryChart({ inventoryItems = [] }) {
  const data = useMemo(() => {
    const map = {}
    ;(inventoryItems || []).forEach((it) => {
      const key = it.productName || it.productId || 'Unknown'
      if (!map[key]) map[key] = { name: key, qty: 0, category: it.category || 'Uncategorized' }
      map[key].qty += Number(it.qty || 0)
    })
    return Object.values(map)
  }, [inventoryItems])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-500">Inventory</p>
        <h2 className="text-xl font-semibold text-slate-950">Quantity by product</h2>
      </div>
      {data.length ? (
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#e6edf3" strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
              <Tooltip labelFormatter={(value) => `Product: ${value}`} />
              <Bar dataKey="qty" name="Quantity" fill="#059669" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No inventory items available.
        </div>
      )}
    </div>
  )
}
