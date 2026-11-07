export default function StatCard({ label, value, icon, highlight, onClick, className = '' }) {
  const Icon = icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-[1.75rem] border border-slate-200/70 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 transition duration-200 group-hover:text-emerald-700">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${highlight || 'bg-emerald-600'} shadow-[0_16px_40px_-24px_rgba(16,185,129,0.45)]`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </button>
  )
}
