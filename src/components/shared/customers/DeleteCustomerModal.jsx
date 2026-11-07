import { AlertTriangle, X } from 'lucide-react'

export default function DeleteCustomerModal({ open, onClose, onConfirm, customer }) {
  if (!open || !customer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Delete customer</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Remove {customer.name}?</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 rounded-3xl bg-rose-50 p-4 text-rose-700">
            <AlertTriangle size={20} className="mt-0.5" />
            <p className="text-sm">
              This action will remove the customer from the shared ERP records. Sales history linked to the account will remain in the system, but the customer profile will no longer appear in the customer directory.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} className="rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
              Delete customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
