import { Eye, Edit2, UserPlus, Trash2 } from 'lucide-react'

export default function UserTable({ users = [], onView, onEdit, onDelete, onToggle }) {
  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No salesmen found.</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{u.fullName}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => onView(u)} title="View" className="rounded-md p-2 text-slate-600 hover:bg-slate-100"><Eye size={16} /></button>
                    <button onClick={() => onEdit(u)} title="Edit" className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50"><Edit2 size={16} /></button>
                    <button onClick={() => onToggle(u)} title="Toggle status" className="rounded-md p-2 text-blue-600 hover:bg-blue-50"><UserPlus size={16} /></button>
                    <button onClick={() => onDelete(u)} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 sm:hidden">
        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">No salesmen found.</div>
        ) : users.map((u) => (
          <div key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{u.fullName}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{u.status}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{u.phone || '—'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => onView(u)} className="flex-1 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">View</button>
              <button onClick={() => onEdit(u)} className="flex-1 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">Edit</button>
              <button onClick={() => onToggle(u)} className="flex-1 rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100">Toggle</button>
              <button onClick={() => onDelete(u)} className="flex-1 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
