import { useAuth } from '../../context/AuthContext'

export default function ManageUsersPage() {
  const { users } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-xl font-semibold text-slate-950">User Management</h2>
        <p className="mt-2 text-sm text-slate-500">Review and manage user accounts for admin and salesman access.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="px-6 py-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Team accounts</div>
        <div className="divide-y divide-slate-200">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">{user.fullName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  {user.role}
                </span>
                <span className="text-sm text-slate-500">{user.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
