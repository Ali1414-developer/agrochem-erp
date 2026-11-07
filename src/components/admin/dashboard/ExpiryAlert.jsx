export default function ExpiryAlert({ nearExpiryBatches }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <p className="text-sm font-medium text-slate-500">Batch Expiry Alerts</p>
      <div className="mt-4 space-y-3">
        {nearExpiryBatches.length > 0 ? (
          nearExpiryBatches.map((batch) => (
            <div key={batch.id} className="rounded-3xl bg-amber-50 p-4">
              <p className="font-semibold text-slate-950">{batch.batchNumber}</p>
              <p className="text-sm text-slate-600">{batch.productName}</p>
              <p className="text-sm text-amber-700">Expires on {batch.expiryDate}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No batches are approaching expiry within the next 30 days.</p>
        )}
      </div>
    </div>
  )
}
