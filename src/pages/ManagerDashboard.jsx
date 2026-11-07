import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true })
    }
  }, [currentUser, navigate])

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Sales Dashboard</p>
              <h1 className="text-3xl font-semibold text-slate-950">Welcome back, {currentUser?.fullName}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-600">
            Access your sales workspace to oversee inventory movement, sales activity, and operations workflows.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">24</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-medium text-slate-500">Pending Receipts</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">8</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <p className="text-sm font-medium text-slate-500">Inventory Alerts</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">3</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/sales/pos')}
            className="inline-flex items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Open POS
          </button>
          <button
            type="button"
            onClick={() => navigate('/sales/customers')}
            className="inline-flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Manage Customers
          </button>
        </div>
      </div>
    </div>
  )
}
