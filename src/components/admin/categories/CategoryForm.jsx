import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function CategoryForm({ open, onClose, onSave, category }) {
  const [name, setName] = useState('')

  useEffect(() => { if (category) setName(category.name || '') ; else setName('') }, [category])
  if (!open) return null

  const submit = () => {
    const trimmed = (name || '').trim()
    if (!trimmed) { alert('Category name required'); return }
    onSave({ id: category?.id || `cat-${Date.now()}`, name: trimmed })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{category ? 'Edit category' : 'Add category'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X /></button>
        </div>

        <div className="mt-4">
          <label className="sr-only">Category name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Category name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
