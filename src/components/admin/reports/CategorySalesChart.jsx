import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function CategorySalesChart({ data }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Sales by category</p>
          <h2 className="text-xl font-semibold text-slate-950">Category performance</h2>
        </div>
      </div>
      {data.length ? (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="revenue" name="Revenue" fill="#047857" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No category sales found for the selected criteria.
        </div>
      )}
    </div>
  )
}
