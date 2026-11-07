export default function LowStockAlert({ lowStockItems }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
      <div className="mt-4 space-y-3">
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item) => (
            <div key={item.id} className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-slate-950">{item.productName || item.name}</p>
              <p className="text-sm font-semibold text-amber-700">Only {item.qty} units left</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">All products are stocked above the low inventory threshold.</p>
        )}
      </div>
    </div>
  )
}
