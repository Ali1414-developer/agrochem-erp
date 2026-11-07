import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProfileHeader from '../../components/admin/profile/ProfileHeader'
import ProfileForm from '../../components/admin/profile/ProfileForm'
import ChangePasswordForm from '../../components/admin/profile/ChangePasswordForm'

const initialForm = (user) => ({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  role: user?.role || 'admin',
})

const initialPasswordForm = () => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

export default function ProfilePage() {
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
    setMessage({ type: 'success', text: 'Profile updated successfully.' })
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
        <div className={`rounded-3xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      ) : null}

      <ProfileHeader user={currentUser} avatar={avatar} onAvatarChange={handleAvatarChange} />

      <ProfileForm
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

      <ChangePasswordForm
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
