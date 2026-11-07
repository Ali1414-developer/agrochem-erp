import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function CustomerSelector({ customers = [], customer = {}, onCustomerChange, onSelectCustomer }) {
  const [query, setQuery] = useState('')

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

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div>
        <p className="text-sm font-semibold text-slate-900">Customer details</p>
        <p className="mt-1 text-sm text-slate-500">Search existing customers or capture new buyer details.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer by name, email or phone"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={16} />
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
            {customer.email ? <p className="text-sm text-slate-500">{customer.email}</p> : null}
            {customer.phone ? <p className="text-sm text-slate-500">{customer.phone}</p> : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No customer selected yet.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-600">
          <span>Name</span>
          <input
            value={customer.name || ''}
            onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
            placeholder="Customer name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-600">
          <span>Email</span>
          <input
            value={customer.email || ''}
            onChange={(e) => onCustomerChange({ ...customer, email: e.target.value })}
            placeholder="Customer email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-slate-600">
        <span>Phone</span>
        <input
          value={customer.phone || ''}
          onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
          placeholder="Customer phone"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
    </div>
  )
}
