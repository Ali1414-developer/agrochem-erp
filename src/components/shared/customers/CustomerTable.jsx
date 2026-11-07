import { Eye, Edit3, Trash2, Printer, Download } from 'lucide-react'
import { downloadCustomerSlipFile } from './CustomerSlipModal'

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`
}

export default function CustomerTable({ customers = [], sales = [], onView, onEdit, onDelete, onPrintSlip }) {
  const getCustomerMetrics = (customer) => {
    const matchedSales = (sales || []).filter((sale) => {
      const customerIdMatch = Boolean(customer.id && sale.customerId === customer.id)
      const nameMatch = Boolean(customer.name && sale.customerName && sale.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
      const phoneMatch = Boolean(customer.phone && sale.customerPhone && sale.customerPhone.trim() === customer.phone.trim())

      return (nameMatch && phoneMatch) || (customerIdMatch && phoneMatch)
    })

    const purchaseCount = matchedSales.length || Number(customer.orders || 0)
    const totalPurchase = matchedSales.length > 0 
      ? matchedSales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0) 
      : Number(customer.totalPurchase || 0)
    const lastPurchase = matchedSales[0]?.date || customer.lastPurchase || 'No purchase yet'

    return { purchaseCount, totalPurchase, lastPurchase }
  }

  const handleDirectDownload = (customer) => {
    downloadCustomerSlipFile(customer, sales, 'AgroChem ERP')
  }

  const handleEditClick = (customer) => (event) => {
    event.stopPropagation()
    if (typeof onEdit === 'function') {
      onEdit(customer)
    }
  }

  const handleViewOrders = (customer) => {
    if (typeof onView === 'function') {
      onView(customer)
    }
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Orders</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total purchases</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last purchase</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-slate-500">
                    No customers match the current search.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const metrics = getCustomerMetrics(customer)
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-950">{customer.name}</p>
                          {customer.company ? <p className="text-sm text-slate-500">{customer.company}</p> : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div>{customer.phone || '—'}</div>
                        <div className="text-slate-500">{customer.email || '—'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <button
                          type="button"
                          onClick={() => handleViewOrders(customer)}
                          className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-800 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                          title={`View ${metrics.purchaseCount} order${metrics.purchaseCount === 1 ? '' : 's'} for ${customer.name}`}
                        >
                          {metrics.purchaseCount || 0}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{formatCurrency(metrics.totalPurchase)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{metrics.lastPurchase}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <button type="button" onClick={() => onView(customer)} className="rounded-2xl bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200" title="View Customer Details">
                            <Eye size={16} />
                          </button>
                          <button type="button" onClick={() => handleDirectDownload(customer)} className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100" title="Download Customer Slip File">
                            <Download size={16} />
                          </button>
                          <button type="button" onClick={() => onPrintSlip && onPrintSlip(customer)} className="rounded-2xl bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100" title="Print/Preview Customer Slip">
                            <Printer size={16} />
                          </button>
                          <button type="button" onClick={handleEditClick(customer)} className="rounded-2xl bg-sky-50 p-2 text-sky-700 transition hover:bg-sky-100" title="Edit Customer">
                            <Edit3 size={16} />
                          </button>
                          <button type="button" onClick={() => onDelete?.(customer)} className="rounded-2xl bg-rose-50 p-2 text-rose-700 transition hover:bg-rose-100" title="Delete Customer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 sm:hidden">
        {customers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No customers match the current search.</div>
        ) : (
          customers.map((customer) => {
            const metrics = getCustomerMetrics(customer)
            return (
              <div key={customer.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{customer.name}</p>
                    {customer.company ? <p className="text-sm text-slate-500">{customer.company}</p> : null}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{metrics.purchaseCount} orders</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>{customer.phone || '—'}</p>
                  <p>{customer.email || '—'}</p>
                  <p>{customer.address || '—'}</p>
                </div>
                <div className="mt-3 grid gap-2 rounded-3xl bg-slate-50 p-3 text-sm text-slate-700">
                  <button
                    type="button"
                    onClick={() => handleViewOrders(customer)}
                    className="inline-flex w-full items-center justify-between rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-800 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                    title={`View ${metrics.purchaseCount} order${metrics.purchaseCount === 1 ? '' : 's'} for ${customer.name}`}
                  >
                    <span>Orders</span>
                    <span>{metrics.purchaseCount || 0}</span>
                  </button>
                  <div className="flex items-center justify-between"><span className="font-semibold text-slate-900">Total</span><span>{formatCurrency(metrics.totalPurchase)}</span></div>
                  <div className="flex items-center justify-between"><span className="font-semibold text-slate-900">Last purchase</span><span>{metrics.lastPurchase}</span></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => onView(customer)} className="w-full rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">View</button>
                  <button type="button" onClick={() => onPrintSlip && onPrintSlip(customer)} className="w-full rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">Print Slip</button>
                  <button type="button" onClick={handleEditClick(customer)} className="w-full rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">Edit</button>
                  <button type="button" onClick={() => onDelete?.(customer)} className="w-full rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">Delete</button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
