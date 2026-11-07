export default function CustomerForm({ customer = {}, errors = {}, onChange, onSubmit, onCancel, mode = 'create' }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600">
          <span>Customer name</span>
          <input
            value={customer.name || ''}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="Enter customer name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
          {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Company</span>
          <input
            value={customer.company || ''}
            onChange={(event) => onChange({ company: event.target.value })}
            placeholder="Optional company name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Address</span>
          <input
            value={customer.address || ''}
            onChange={(event) => onChange({ address: event.target.value })}
            placeholder="Customer address"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
          {errors.address ? <p className="text-xs text-rose-600">{errors.address}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Phone number</span>
          <input
            value={customer.phone || ''}
            onChange={(event) => onChange({ phone: event.target.value })}
            placeholder="11-digit phone (e.g. 03001234567)"
            maxLength={11}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
          {errors.phone ? <p className="text-xs text-rose-600">{errors.phone}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
          <span>Email address</span>
          <input
            type="email"
            value={customer.email || ''}
            onChange={(event) => onChange({ email: event.target.value })}
            placeholder="Customer email"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
          <span>Notes</span>
          <textarea
            value={customer.notes || ''}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Optional notes for the account"
            rows="3"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={onCancel} className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Cancel
        </button>
        <button type="submit" className="rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
          {mode === 'edit' ? 'Update customer' : 'Create customer'}
        </button>
      </div>
    </form>
  )
}
