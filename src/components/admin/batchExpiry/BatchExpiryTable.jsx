import ExpiryStatusBadge from './ExpiryStatusBadge'
import { Eye } from 'lucide-react'

export default function BatchExpiryTable({ batches, onView }) {
  if (!batches.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500 shadow-xl shadow-slate-300/25">
        <p className="text-lg font-semibold text-slate-900">No batch entries found</p>
        <p className="mt-2 text-sm">Adjust the filters or add inventory to view batch expiry data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 sm:hidden">
        {batches.map((batch) => (
          <div key={batch.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-300/25">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{batch.productName}</p>
                <p className="mt-1 text-sm text-slate-600">{batch.batchNumber || 'N/A'}</p>
              </div>
              <ExpiryStatusBadge status={batch.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Qty</span>
                <span>{batch.qty}</span>
              </div>
              <div className="flex justify-between">
                <span>Expiry</span>
                <span>{batch.expiryDate}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onView(batch)}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/25">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 text-left uppercase tracking-[0.2em]">Product</th>
              <th className="px-5 py-4 text-left uppercase tracking-[0.2em]">Batch</th>
              <th className="px-5 py-4 text-left uppercase tracking-[0.2em]">Qty</th>
              <th className="px-5 py-4 text-left uppercase tracking-[0.2em]">Expiry</th>
              <th className="px-5 py-4 text-left uppercase tracking-[0.2em]">Status</th>
              <th className="px-5 py-4 text-right uppercase tracking-[0.2em]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {batches.map((batch) => (
              <tr key={batch.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-semibold text-slate-900">{batch.productName}</td>
                <td className="px-5 py-4 text-slate-700">{batch.batchNumber || 'N/A'}</td>
                <td className="px-5 py-4 text-slate-700">{batch.qty}</td>
                <td className="px-5 py-4 text-slate-700">{batch.expiryDate}</td>
                <td className="px-5 py-4">
                  <ExpiryStatusBadge status={batch.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView(batch)}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
