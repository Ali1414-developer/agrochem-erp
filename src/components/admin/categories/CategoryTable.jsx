import { Edit2, Trash2 } from 'lucide-react'

export default function CategoryTable({ categories = [], counts = {}, onEdit, onDelete, onViewProducts }) {
  const hasActions = Boolean(onEdit || onDelete)

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</th>
                <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 ${hasActions ? 'text-left' : 'text-right'}`}>Products</th>
                {hasActions && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={hasActions ? 3 : 2} className="px-4 py-8 text-center text-sm text-slate-500">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const count = counts[cat.name] || 0
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{cat.name}</td>
                      <td className={`px-4 py-3 text-sm ${hasActions ? '' : 'text-right'}`}>
                        <button
                          type="button"
                          onClick={() => onViewProducts && onViewProducts(cat.name)}
                          className="inline-flex min-w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-800 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-xs cursor-pointer"
                          title={`View products in ${cat.name}`}
                        >
                          {count}
                        </button>
                      </td>
                      {hasActions && (
                        <td className="px-4 py-3 text-right text-sm">
                          <div className="inline-flex items-center gap-2">
                            {onEdit ? <button onClick={() => onEdit(cat)} title="Edit" className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50"><Edit2 size={16} /></button> : null}
                            {onDelete ? <button onClick={() => onDelete(cat)} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button> : null}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 sm:hidden">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">No categories found.</div>
        ) : (
          categories.map((cat) => {
            const count = counts[cat.name] || 0
            return (
              <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                      <button
                        type="button"
                        onClick={() => onViewProducts && onViewProducts(cat.name)}
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <span>{count}</span>
                        <span>Products</span>
                      </button>
                    </div>
                    {hasActions && (
                      <div className="inline-flex items-center gap-2">
                        {onEdit ? <button onClick={() => onEdit(cat)} title="Edit" className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"><Edit2 size={16} /></button> : null}
                        {onDelete ? <button onClick={() => onDelete(cat)} title="Delete" className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><Trash2 size={16} /></button> : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
