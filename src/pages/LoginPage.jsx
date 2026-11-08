import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, authError, isAuthLoading, currentUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!isAuthLoading && currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin/dashboard' : '/sales/dashboard', { replace: true })
    }
  }, [currentUser, isAuthLoading, navigate])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validate = () => {
    const errors = {}
    if (!form.email) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!form.password) {
      errors.password = 'Please enter your password.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    const authenticatedUser = await login({
      email: form.email.trim(),
      password: form.password.trim(),
      remember: form.remember,
    })

    if (authenticatedUser) {
      const nextRoute = authenticatedUser.role === 'admin' ? '/admin/dashboard' : '/sales/dashboard'
      navigate(nextRoute, { replace: true })
    }
  }

  const handleAutofill = (role) => {
    if (role === 'admin') {
      setForm((prev) => ({
        ...prev,
        email: 'admin@erp.com',
        password: 'admin@123',
      }))
    } else if (role === 'sales') {
      setForm((prev) => ({
        ...prev,
        email: 'salesman@erp.com',
        password: 'salesman@123',
      }))
    }
    setFieldErrors({})
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_20%),linear-gradient(180deg,#031825,#071b2d_45%,#0a1f38)]" />
      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-4xl border border-slate-200/20 bg-slate-100/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-10">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-emerald-600">AGROCHEM ERP</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Welcome Back</h1>
            <p className="mx-auto max-w-xs text-sm leading-6 text-slate-600">Sign in to continue to your dashboard</p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-3 sm:p-4 shadow-sm backdrop-blur-sm">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              Quick Demo Access (Click to Auto-fill)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="group flex flex-col items-start gap-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-left transition hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Admin Login
                </div>
                <span className="text-[11px] text-slate-600">admin@erp.com</span>
                <span className="text-[10px] text-slate-400 font-mono">Pass: admin@123</span>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('sales')}
                className="group flex flex-col items-start gap-1 rounded-xl border border-blue-200 bg-blue-50/70 p-2.5 text-left transition hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Sales Login
                </div>
                <span className="text-[11px] text-slate-600">salesman@erp.com</span>
                <span className="text-[10px] text-slate-400 font-mono">Pass: salesman@123</span>
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <AuthInput
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              placeholder="you@company.com"
              onChange={handleChange}
              icon="email"
              error={fieldErrors.email}
            />

            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              placeholder="Enter your password"
              onChange={handleChange}
              isPasswordVisible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              error={fieldErrors.password}
            />

            <div className="flex flex-col items-start gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="font-medium text-emerald-600 transition hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded"
              >
                Forgot password?
              </button>
            </div>

            {authError && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isAuthLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">Don't have access? Contact your administrator.</p>
        </div>
      </div>
    </div>
  )
}
