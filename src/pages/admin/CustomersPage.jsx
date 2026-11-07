import { useAuth } from '../../context/AuthContext'

export default function CustomersPage() {
  const { appData } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Customers</h2>
            <p className="mt-2 text-sm text-slate-500">Customer accounts and key distribution partners.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {appData.customers.length} customers
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {appData.customers.map((customer) => (
          <div key={customer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-950">{customer.name}</h3>
            <p className="mt-2 text-sm text-slate-500">Active partner in the AgroChem distribution network.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
