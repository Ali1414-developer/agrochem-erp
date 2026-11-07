import { useLocation } from 'react-router-dom'

export default function SalesPlaceholder() {
  const location = useLocation()
  const path = location.pathname.replace('/sales/', '').replace('-', ' ') || 'dashboard'
  const title = path.charAt(0).toUpperCase() + path.slice(1)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Sales portal</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        The sales workspace is being prepared. Authentication and route protection are active, and the sales experience can be added here next.
      </p>
    </div>
  )
}
