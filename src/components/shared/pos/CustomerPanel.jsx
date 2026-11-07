import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function CustomerPanel({ customers = [], customer = {}, onCustomerChange, onSelectCustomer }) {
  const [query, setQuery] = useState('')
  const [errors, setErrors] = useState({})

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return customers.filter((item) => {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term)
      )
    })
  }, [customers, query])

  const validatePhone = (phone) => {
    const digits = (phone || '').replace(/\D/g, '')
    return digits.length === 11
  }

  const validateEmail = (email) => {
    const trimmed = (email || '').trim()
    return !trimmed || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  const handleFieldChange = (field, value) => {
    const nextCustomer = { ...customer, [field]: value }
    onCustomerChange(nextCustomer)

    if (field === 'phone' && value && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Phone number must be exactly 11 digits.' }))
    } else if (field === 'email' && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-5 rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50/60 p-6 shadow-2xl">
      <div>
        <p className="text-sm font-semibold text-slate-900">Customer details</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer by name, email or phone"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
            <Search size={18} />
          </div>
        </div>

        {suggestions.length > 0 ? (
          <div className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-3">
            {suggestions.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectCustomer(item)
                  setQuery('')
                }}
                className="rounded-3xl px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.email || item.phone || 'No contact details'}</p>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected customer</p>
        {customer?.name ? (
          <div className="mt-3 space-y-1">
            <p className="font-semibold text-slate-900">{customer.name}</p>
            {customer.address ? <p className="text-sm text-slate-500">{customer.address}</p> : null}
            {customer.phone ? <p className="text-sm text-slate-500">{customer.phone}</p> : null}
            {customer.email ? <p className="text-sm text-slate-500">{customer.email}</p> : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No customer selected yet.</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="space-y-2 text-sm text-slate-600">
          <span>Full name</span>
          <input
            value={customer.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Customer name"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {!customer.name ? <p className="text-xs text-rose-600">Customer name is required.</p> : null}
        </label>
        <label className="space-y-2 text-sm text-slate-600">
          <span>Address</span>
          <input
            value={customer.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="Customer address"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {!customer.address ? <p className="text-xs text-rose-600">Customer address is required.</p> : null}
        </label>
        <label className="space-y-2 text-sm text-slate-600">
          <span>Phone number</span>
          <input
            value={customer.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="11-digit phone (e.g. 03001234567)"
            maxLength={11}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {customer.phone && !validatePhone(customer.phone) ? (
            <p className="text-xs text-rose-600">Phone number must be exactly 11 digits.</p>
          ) : !customer.phone ? (
            <p className="text-xs text-rose-600">Customer phone number is required.</p>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-slate-600">
          <span>Email address</span>
          <input
            value={customer.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Customer email (optional)"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          {customer.email && !validateEmail(customer.email) ? (
            <p className="text-xs text-rose-600">Please enter a valid email address.</p>
          ) : null}
        </label>
      </div>
    </div>
  )
}
