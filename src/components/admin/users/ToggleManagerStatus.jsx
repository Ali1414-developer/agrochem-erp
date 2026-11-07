export default function ToggleManagerStatus({ user, onToggle }) {
  const active = user?.status === 'active'
  return (
    <button onClick={() => onToggle(user)} className={`rounded-full px-3 py-1 text-sm font-semibold ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
      {active ? 'Deactivate' : 'Activate'}
    </button>
  )
}
