import { useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#16a34a', '#0ea5e9', '#f97316', '#8b5cf6', '#ec4899', '#eab308', '#22c55e', '#38bdf8', '#fb7185', '#c084fc']

export default function CategoryPieChart({ categories = [], products = [] }) {
  const data = useMemo(() => {
    const productCounts = (products || []).reduce((map, product) => {
      const category = product.category || 'Uncategorized'
      map[category] = (map[category] || 0) + 1
      return map
    }, {})

    const categoryNames = Array.from(
      new Set([
        ...(categories || []).map((cat) => cat.name || 'Uncategorized'),
        ...Object.keys(productCounts),
      ]),
    )

    return categoryNames.map((name) => ({
      name,
      value: productCounts[name] || 0,
    }))
  }, [categories, products])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-500">Category distribution</p>
        <h2 className="text-xl font-semibold text-slate-950">Products by category</h2>
      </div>

      {data.length ? (
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, 'Products']}
                itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No categories available yet.
        </div>
      )}
    </div>
  )
}
