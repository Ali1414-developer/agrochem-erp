import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminHeader({ title, onToggleSidebar }) {
  const { logout } = useAuth()

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin / {title}</p>
          <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
        </div>
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )
}
