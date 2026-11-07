import { useAuth } from '../../context/AuthContext'

export default function CustomersListPage() {
  const { appData } = useAuth()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-xl font-semibold text-slate-950">Customers</h2>
        <p className="mt-2 text-sm text-slate-500">Active customer accounts and partner profiles.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {appData.customers.map((customer) => (
          <div key={customer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-950">{customer.name}</h3>
            <p className="mt-2 text-sm text-slate-500">Key account for distribution and B2B procurement.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
