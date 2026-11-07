import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { requestPasswordReset, resetPassword } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ email: '', code: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    const nextErrors = {}

    if (!form.email) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateStep2 = () => {
    const nextErrors = {}

    if (!form.code) {
      nextErrors.code = 'Please enter the verification code.'
    }

    if (!form.password) {
      nextErrors.password = 'Please enter a new password.'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password.'
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)

    if (step === 1) {
      if (!validateStep1()) return

      setIsSubmitting(true)
      const result = requestPasswordReset({ email: form.email.trim() })
      setIsSubmitting(false)

      if (result.success) {
        setForm((prev) => ({ ...prev, code: result.code }))
        setErrors({})
        setMessage({ type: 'success', text: `${result.message} Your code is ${result.code}.` })
        setStep(2)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
      return
    }

    if (step === 2) {
      if (!validateStep2()) return

      setIsSubmitting(true)
      const result = resetPassword({
        email: form.email.trim(),
        code: form.code.trim(),
        newPassword: form.password.trim(),
      })
      setIsSubmitting(false)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setForm({ email: '', code: '', password: '', confirmPassword: '' })
        setShowPassword(false)
        setShowConfirmPassword(false)
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(52,211,153,0.16), transparent 24%), radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 20%), linear-gradient(180deg, #031825, #071b2d 45%, #0a1f38)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-4xl border border-slate-200/20 bg-slate-100/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-10">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-emerald-600">AGROCHEM ERP</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {step === 1 ? 'Forgot Password' : 'Enter Verification Code'}
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600">
              {step === 1
                ? 'Enter your registered email to receive a verification code.'
                : 'Enter the code sent to your email and choose a new password.'}
            </p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                disabled={step === 2}
              />
              {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
            </div>

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Verification Code</label>
                  <input
                    name="code"
                    type="text"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Enter the 6-digit code"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                  {errors.code && <p className="text-sm text-rose-600">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="New password"
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M3.707 2.293a1 1 0 0 0-1.414 1.414l2.154 2.154A11.955 11.955 0 0 0 1.85 12c2.074 3.52 5.474 6 9.15 6 1.85 0 3.61-.48 5.15-1.323l2.154 2.154a1 1 0 0 0 1.414-1.414L4.707 2.293zM12 16a4 4 0 0 1-4-4c0-.672.165-1.304.455-1.854L12 12.59l3.545 3.545A3.987 3.987 0 0 1 12 16zm0-10a9.943 9.943 0 0 0-6.893 2.716L8.11 9.72A4.001 4.001 0 0 1 12 6c1.041 0 1.99.402 2.71 1.057l1.952-1.952A9.939 9.939 0 0 0 12 6z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M12 4.5c-4.856 0-8.902 3.06-10.549 7.5C3.098 16.94 7.144 20 12 20c4.856 0 8.902-3.06 10.549-7.5C20.902 7.56 16.856 4.5 12 4.5zm0 12.5c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M3.707 2.293a1 1 0 0 0-1.414 1.414l2.154 2.154A11.955 11.955 0 0 0 1.85 12c2.074 3.52 5.474 6 9.15 6 1.85 0 3.61-.48 5.15-1.323l2.154 2.154a1 1 0 0 0 1.414-1.414L4.707 2.293zM12 16a4 4 0 0 1-4-4c0-.672.165-1.304.455-1.854L12 12.59l3.545 3.545A3.987 3.987 0 0 1 12 16zm0-10a9.943 9.943 0 0 0-6.893 2.716L8.11 9.72A4.001 4.001 0 0 1 12 6c1.041 0 1.99.402 2.71 1.057l1.952-1.952A9.939 9.939 0 0 0 12 6z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M12 4.5c-4.856 0-8.902 3.06-10.549 7.5C3.098 16.94 7.144 20 12 20c4.856 0 8.902-3.06 10.549-7.5C20.902 7.56 16.856 4.5 12 4.5zm0 12.5c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-rose-600">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {message && (
              <p className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isSubmitting
                ? step === 1
                  ? 'Requesting...' 
                  : 'Resetting...'
                : step === 1
                ? 'Send Verification Code'
                : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
