import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const iconMap = {
  email: Mail,
  password: Lock,
}

export default function AuthInput({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  onToggle,
  isPasswordVisible,
  icon,
  error,
}) {
  const Icon = iconMap[icon]

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={name === 'email' ? 'email' : 'current-password'}
          onChange={onChange}
          className="w-full rounded-2xl border-0 bg-transparent py-4 pl-12 pr-14 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}
