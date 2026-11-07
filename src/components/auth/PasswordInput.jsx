import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({
  label,
  name,
  value,
  placeholder,
  onChange,
  isPasswordVisible,
  onToggle,
  error,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id={name}
          name={name}
          type={isPasswordVisible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoComplete="current-password"
          onChange={onChange}
          className="w-full rounded-2xl border-0 bg-transparent py-4 pl-12 pr-14 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}
