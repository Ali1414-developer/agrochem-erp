export default function InventoryOverview({ inventoryItems }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Inventory Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{inventoryItems.length} distinct items</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {inventoryItems.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">{item.productName}</p>
              <p className="text-sm text-slate-500">{item.warehouse}</p>
            </div>
            <p className="text-lg font-semibold text-slate-950">{item.qty}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
