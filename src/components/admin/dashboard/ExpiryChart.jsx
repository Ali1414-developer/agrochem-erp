import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function ExpiryChart({ nearExpiryBatches = [] }) {
  const data = useMemo(() => {
    return (nearExpiryBatches || [])
      .map((item) => ({
        name: item.productName || item.name || item.batchNumber || 'Unknown',
        daysLeft: Math.max(0, Math.round((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 6)
  }, [nearExpiryBatches])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Expiring soon</p>
          <h2 className="text-xl font-semibold text-slate-950">Batches nearing expiry</h2>
        </div>
        <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          {nearExpiryBatches.length} batches
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
              <Tooltip
                formatter={(value) => [value, 'Days left']}
                labelFormatter={(value) => `Item: ${value}`}
                contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }}
              />
              <Bar dataKey="daysLeft" name="Days until expiry" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No batches are expiring soon.
        </div>
      )}
    </div>
  )
}
