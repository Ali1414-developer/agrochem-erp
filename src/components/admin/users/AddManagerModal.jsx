import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function AddManagerModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })

  useEffect(() => { if (!open) setForm({ fullName: '', email: '', password: '', phone: '' }) }, [open])

  if (!open) return null

  const handle = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const submit = () => {
    if (!form.fullName.trim()) {
      alert('Please enter full name.')
      return
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert('Please enter a valid email address.')
      return
    }
    if (!form.password) {
      alert('Please enter password.')
      return
    }
    if (form.phone?.trim()) {
      const digits = form.phone.replace(/\D/g, '')
      if (digits.length !== 11) {
        alert('Phone number must be exactly 11 digits.')
        return
      }
    }
    onSave({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password, phone: form.phone.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Add Salesman</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X /></button>
        </div>

        <div className="mt-4 grid gap-3">
          <input value={form.fullName} onChange={(e)=>handle('fullName', e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={form.email} onChange={(e)=>handle('email', e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input type="password" value={form.password} onChange={(e)=>handle('password', e.target.value)} placeholder="Password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={form.phone} onChange={(e)=>handle('phone', e.target.value)} placeholder="Phone (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Create Salesman</button>
        </div>
      </div>
    </div>
  )
}
