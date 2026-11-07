import { useAuth } from '../../context/AuthContext'

export default function ProductListPage() {
  const { appData } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Product Catalog</h2>
            <p className="mt-2 text-sm text-slate-500">All active products and active categories in the ERP.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {appData.products.map((product) => (
          <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{product.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{product.name}</h3>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
