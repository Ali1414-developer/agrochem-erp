import { useAuth } from '../../context/AuthContext'

export default function BatchExpiryListPage() {
  const { appData } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-xl font-semibold text-slate-950">Batch Expiry Alerts</h2>
        <p className="mt-2 text-sm text-slate-500">Monitor expiry dates and batch health for your product inventory.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {appData.batches.map((batch) => (
          <div key={batch.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{batch.batchNumber}</h3>
                <p className="mt-2 text-sm text-slate-500">{batch.productName}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                {new Date(batch.expiryDate) < new Date() ? 'Expired' : 'Upcoming'}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">Expiry: {batch.expiryDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
