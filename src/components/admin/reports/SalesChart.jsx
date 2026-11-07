import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function SalesChart({ data }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Sales trend</p>
          <h2 className="text-xl font-semibold text-slate-950">Revenue and unit movement</h2>
        </div>
      </div>
      {data.length ? (
        <div className="h-52 sm:h-56 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} padding={{ left: 8, right: 8 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#047857" fill="url(#colorRevenue)" strokeWidth={3} />
              <Area type="monotone" dataKey="units" name="Units sold" stroke="#0ea5e9" fill="url(#colorUnits)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No sales data available for the selected filters.
        </div>
      )}
    </div>
  )
}
