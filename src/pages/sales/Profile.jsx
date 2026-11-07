import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X, Eye, EyeOff, User, Lock, Camera, Check, AlertCircle } from 'lucide-react'

function SalesProfileHeader({ user, avatar, onAvatarChange }) {
  const [showModal, setShowModal] = useState(false)

  const initials = (user?.fullName || 'Sales')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <div className="rounded-4xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/70 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Clickable Profile Avatar */}
            <div className="relative group shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-600/30 bg-emerald-50 text-3xl font-extrabold text-emerald-700 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-600 group-hover:ring-4 group-hover:ring-emerald-500/20 focus:outline-none cursor-pointer"
                title="Click to view full picture"
              >
                {avatar ? (
                  <img src={avatar} alt="Sales avatar" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Eye className="h-7 w-7 text-white drop-shadow-md" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-0.5">View</span>
                </div>
              </button>
            </div>

            <div className="min-w-0">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                Sales Portal Profile
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 truncate">{user?.fullName || 'Sales Representative'}</h2>
              <p className="mt-0.5 text-sm text-slate-500 truncate">{user?.email || 'sales@agrochem.com'}</p>
            </div>
          </div>

          <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 hover:border-emerald-300 sm:w-auto">
            <Camera className="h-4 w-4" />
            <span>Upload new avatar</span>
            <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Lightbox Modal for Full Picture View */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-xl w-full rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{user?.fullName || 'Sales Representative'}</h3>
                <p className="text-xs text-slate-400">Sales Profile Picture</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-2 border border-slate-800">
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.fullName || 'Full profile picture'}
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-full bg-emerald-800/50 border-4 border-emerald-500/40 text-6xl font-extrabold text-emerald-200">
                  {initials}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SalesProfileForm({ form, errors, submitting, onChange, onSubmit, onCancel, onFieldBlur }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)]">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
        <User className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-950">Personal Information</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>Full Name</span>
          <input
            value={form.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            onBlur={() => onFieldBlur('fullName')}
            placeholder="Enter full name"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          />
          {errors.fullName ? <p className="text-xs font-semibold text-rose-600">{errors.fullName}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>Email Address</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={() => onFieldBlur('email')}
            placeholder="Enter email address"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          />
          {errors.email ? <p className="text-xs font-semibold text-rose-600">{errors.email}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>Phone Number</span>
          <input
            value={form.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            onBlur={() => onFieldBlur('phone')}
            placeholder="11-digit phone (e.g. 03001234567)"
            maxLength={11}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          />
          {errors.phone ? <p className="text-xs font-semibold text-rose-600">{errors.phone}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>Assigned Role</span>
          <input
            value={form.role === 'salesman' ? 'Sales Representative' : form.role}
            readOnly
            className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-xs cursor-not-allowed"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-3xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-3xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 shadow-sm cursor-pointer"
        >
          {submitting ? 'Saving changes...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function SalesChangePasswordForm({ form, errors, submitting, onChange, onSubmit, onCancel }) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100/80 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)]">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
        <Lock className="h-5 w-5 text-slate-800" />
        <h3 className="text-lg font-bold text-slate-950">Security & Password</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>Current Password</span>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(event) => onChange('currentPassword', event.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
            />
            <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword ? <p className="text-xs font-semibold text-rose-600">{errors.currentPassword}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-700 font-medium">
          <span>New Password</span>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(event) => onChange('newPassword', event.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
            />
            <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword ? <p className="text-xs font-semibold text-rose-600">{errors.newPassword}</p> : null}
        </label>

        <label className="space-y-2 text-sm text-slate-700 font-medium md:col-span-2">
          <span>Confirm New Password</span>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
            />
            <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-xs font-semibold text-rose-600">{errors.confirmPassword}</p> : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-3xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-3xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 shadow-sm cursor-pointer"
        >
          {submitting ? 'Updating password...' : 'Update password'}
        </button>
      </div>
    </form>
  )
}

const initialForm = (user) => ({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  role: user?.role || 'salesman',
})

const initialPasswordForm = () => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

export default function SalesProfilePage() {
  const { currentUser, updateUser } = useAuth()
  const [form, setForm] = useState(initialForm(currentUser))
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm())
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [avatar, setAvatar] = useState(currentUser?.avatar || '')
  const [submitting, setSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    setForm(initialForm(currentUser))
    setAvatar(currentUser?.avatar || '')
  }, [currentUser])

  const validateProfile = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'

    const phoneDigits = (form.phone || '').replace(/\D/g, '')
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (phoneDigits.length !== 11) {
      nextErrors.phone = 'Phone number must be exactly 11 digits.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validatePassword = () => {
    const nextErrors = {}

    if (!passwordForm.currentPassword) nextErrors.currentPassword = 'Current password is required.'
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) nextErrors.newPassword = 'Password must be at least 6 characters.'
    if (passwordForm.newPassword !== passwordForm.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'

    if (passwordForm.currentPassword && passwordForm.currentPassword !== currentUser?.password) {
      nextErrors.currentPassword = 'Current password is incorrect.'
    }

    setPasswordErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (!validateProfile()) return

    setSubmitting(true)
    setMessage({ type: '', text: '' })

    await new Promise((resolve) => setTimeout(resolve, 600))

    const updatedUser = {
      ...currentUser,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatar,
    }

    updateUser(currentUser.id, updatedUser)
    setMessage({ type: 'success', text: 'Sales profile updated successfully.' })
    setSubmitting(false)
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    if (!validatePassword()) return

    setPasswordSubmitting(true)
    setMessage({ type: '', text: '' })

    await new Promise((resolve) => setTimeout(resolve, 600))

    const updatedUser = { ...currentUser, password: passwordForm.newPassword }
    updateUser(currentUser.id, updatedUser)
    setPasswordForm(initialPasswordForm())
    setMessage({ type: 'success', text: 'Password changed successfully.' })
    setPasswordSubmitting(false)
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = reader.result
      setAvatar(imageData)
      if (currentUser) {
        updateUser(currentUser.id, { ...currentUser, avatar: imageData })
      }
      setMessage({ type: 'success', text: 'Avatar updated successfully.' })
    }
    reader.readAsDataURL(file)
  }

  const resetProfile = () => {
    setForm(initialForm(currentUser))
    setErrors({})
    setMessage({ type: '', text: '' })
  }

  const resetPassword = () => {
    setPasswordForm(initialPasswordForm())
    setPasswordErrors({})
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="space-y-6">
      {message.text ? (
        <div className={`flex items-center gap-3 rounded-3xl border px-5 py-3.5 text-sm font-semibold shadow-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
          {message.type === 'success' ? <Check className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      ) : null}

      <SalesProfileHeader user={currentUser} avatar={avatar} onAvatarChange={handleAvatarChange} />

      <SalesProfileForm
        form={form}
        errors={errors}
        submitting={submitting}
        onChange={(field, value) => {
          setForm((prev) => ({ ...prev, [field]: value }))
          setErrors((prev) => ({ ...prev, [field]: undefined }))
        }}
        onFieldBlur={(field) => {
          if (field === 'fullName' && !form.fullName.trim()) {
            setErrors((prev) => ({ ...prev, fullName: 'Full name is required.' }))
          }
          if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setErrors((prev) => ({ ...prev, email: 'Please enter a valid email.' }))
          }
          if (field === 'phone' && !form.phone.trim()) {
            setErrors((prev) => ({ ...prev, phone: 'Phone number is required.' }))
          }
        }}
        onSubmit={handleProfileSubmit}
        onCancel={resetProfile}
      />

      <SalesChangePasswordForm
        form={passwordForm}
        errors={passwordErrors}
        submitting={passwordSubmitting}
        onChange={(field, value) => {
          setPasswordForm((prev) => ({ ...prev, [field]: value }))
          setPasswordErrors((prev) => ({ ...prev, [field]: undefined }))
        }}
        onSubmit={handlePasswordSubmit}
        onCancel={resetPassword}
      />
    </div>
  )
}
