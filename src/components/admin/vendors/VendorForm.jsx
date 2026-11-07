import { useEffect, useState } from 'react'

export default function VendorForm({ open, vendor, onClose, onSave }) {
  if (!open) return null

  const initial = vendor || { name: '', company: '', phone: '', email: '', address: '', notes: '' }
  const [form, setForm] = useState(initial)

  useEffect(() => {
    if (open) {
      setForm(vendor || initial)
    }
  }, [vendor, open])

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = () => {
    if (!form.name?.trim() || !form.company?.trim() || !form.phone?.trim()) {
      alert('Vendor name, company and phone are required.')
      return
    }
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length !== 11) {
      alert('Phone number must be exactly 11 digits.')
      return
    }
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert('Please enter a valid email address.')
      return
    }
    onSave({ ...form, id: form.id || `vendor_${Date.now()}` })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{vendor ? 'Edit vendor' : 'Add new vendor'}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">✕</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-600">
            <span>Vendor name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Company name</span>
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="col-span-2 space-y-2 text-sm text-slate-600">
            <span>Address</span>
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="col-span-2 space-y-2 text-sm text-slate-600">
            <span>Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Cancel
          </button>
          <button type="button" onClick={submit} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Save vendor
          </button>
        </div>
      </div>
    </div>
  )
}
