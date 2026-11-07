import { X } from 'lucide-react'

export default function ManagerDetailsModal({ open, onClose, user }) {
  if (!open || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Salesman details</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X /></button>
        </div>

        <div className="mt-4 text-sm text-slate-700 grid gap-3">
          <div><div className="text-slate-500">Name</div><div className="font-semibold text-slate-900">{user.fullName}</div></div>
          <div><div className="text-slate-500">Email</div><div className="font-semibold text-slate-900">{user.email}</div></div>
          <div><div className="text-slate-500">Phone</div><div className="font-semibold text-slate-900">{user.phone || '—'}</div></div>
          <div><div className="text-slate-500">Role</div><div className="font-semibold text-slate-900">{user.role}</div></div>
          <div><div className="text-slate-500">Status</div><div className="font-semibold text-slate-900">{user.status}</div></div>
          <div><div className="text-slate-500">Created</div><div className="font-semibold text-slate-900">{user.createdAt || '—'}</div></div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>
      </div>
    </div>
  )
}
