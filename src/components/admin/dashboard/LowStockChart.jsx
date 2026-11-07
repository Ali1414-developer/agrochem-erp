import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'

export default function LowStockChart({ lowStockItems = [] }) {
  const data = useMemo(() => {
    return (lowStockItems || [])
      .map((item) => ({
        name: item.name || item.productName || item.sku || item.id || 'Unknown',
        qty: Number(item.qty || 0),
        threshold: Number(item.threshold || 0),
      }))
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 6)
  }, [lowStockItems])

  const threshold = data.length ? Math.max(...data.map((item) => item.threshold || 0)) : 0

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Low stock</p>
          <h2 className="text-xl font-semibold text-slate-950">Products below threshold</h2>
        </div>
        <div className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
          {lowStockItems.length} products
        </div>
      </div>

      {data.length ? (
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 12 }}>
              <CartesianGrid stroke="#e6edf3" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              {threshold > 0 && (
                <ReferenceLine y={threshold} stroke="#f97316" strokeDasharray="5 5" label={{ position: 'right', value: 'Threshold', fill: '#f97316', fontSize: 12 }} />
              )}
              <Tooltip
                formatter={(value) => [value, 'Units left']}
                labelFormatter={(value) => `Product: ${value}`}
                contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }}
              />
              <Bar dataKey="qty" name="Quantity" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No low-stock items at the moment.
        </div>
      )}
    </div>
  )
}
