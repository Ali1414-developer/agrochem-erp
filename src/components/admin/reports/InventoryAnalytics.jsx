export default function InventoryAnalytics({ lowStock, nearExpiry }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Low stock</p>
          <h2 className="text-xl font-semibold text-slate-950">Products below threshold</h2>
        </div>
        {lowStock.length ? (
          <div className="space-y-4">
            {lowStock.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-sm text-slate-500">Category: {item.category || 'Uncategorized'}</p>
                </div>
                <span className="rounded-2xl bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">{item.qty}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            No products require urgent restock.
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Near expiry</p>
          <h2 className="text-xl font-semibold text-slate-950">Batches due soon</h2>
        </div>
        {nearExpiry.length ? (
          <div className="space-y-4">
            {nearExpiry.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{batch.productName}</p>
                  <p className="text-sm text-slate-500">Expiry: {batch.expiryDate}</p>
                </div>
                <span className="rounded-2xl bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{batch.daysLeft} days</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            No batches are approaching expiry in the selected range.
          </div>
        )}
      </div>
    </div>
  )
}
