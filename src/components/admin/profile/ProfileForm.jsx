export default function ProfileForm({ form, errors, submitting, onChange, onSubmit, onCancel, onFieldBlur }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/70 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.28)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600">
          <span>Full name</span>
          <input
            value={form.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            onBlur={() => onFieldBlur('fullName')}
            placeholder="Enter full name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {errors.fullName ? <p className="text-xs text-rose-600">{errors.fullName}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={() => onFieldBlur('email')}
            placeholder="Enter email"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            onBlur={() => onFieldBlur('phone')}
            placeholder="11-digit phone (e.g. 03001234567)"
            maxLength={11}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {errors.phone ? <p className="text-xs text-rose-600">{errors.phone}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Role</span>
          <input value={form.role} readOnly className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-sm" />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={onCancel} className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300">
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
