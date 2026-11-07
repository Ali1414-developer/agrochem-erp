import { RefreshCcw } from 'lucide-react'

export default function POSHeader({ cartCount, totalAmount, onNewSale }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">Point of Sale</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create sales with a professional register workflow</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
            {cartCount} item{cartCount === 1 ? '' : 's'} in current sale
          </div>
          <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
            ${totalAmount.toFixed(2)} current total
          </div>
          <button
            type="button"
            onClick={onNewSale}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RefreshCcw size={16} /> New Sale
          </button>
        </div>
      </div>
    </div>
  )
}
