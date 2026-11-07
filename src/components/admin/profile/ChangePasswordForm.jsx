import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordForm({ form, errors, submitting, onChange, onSubmit, onCancel }) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.28)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600">
          <span>Current password</span>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(event) => onChange('currentPassword', event.target.value)}
              placeholder="Current password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword ? <p className="text-xs text-rose-600">{errors.currentPassword}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>New password</span>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(event) => onChange('newPassword', event.target.value)}
              placeholder="New password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword ? <p className="text-xs text-rose-600">{errors.newPassword}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
          <span>Confirm password</span>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-xs text-rose-600">{errors.confirmPassword}</p> : null}
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={onCancel} className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-3xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
          {submitting ? 'Updating...' : 'Change password'}
        </button>
      </div>
    </form>
  )
}
