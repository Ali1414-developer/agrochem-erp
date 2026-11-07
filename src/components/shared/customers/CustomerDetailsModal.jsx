import { X, Trash2, Edit3, Printer, Download } from 'lucide-react'
import { downloadSaleSlipFile, printSaleSlip } from '../../../utils/exportCustomers'

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`
}

function getSaleItems(sale) {
  if (Array.isArray(sale.products) && sale.products.length > 0) {
    return sale.products
  }
  if (Array.isArray(sale.cart) && sale.cart.length > 0) {
    return sale.cart.map((item) => ({
      productId: item.productId || item.id,
      name: item.name || item.productName || item.title || 'Unknown product',
      quantity: item.quantity || item.qty || 0,
      unitPrice: item.price || item.unitPrice || item.totalPrice || 0,
      total: item.total || item.totalPrice || (item.quantity || 0) * (item.unitPrice || 0),
    }))
  }
  return []
}

export default function CustomerDetailsModal({ open, onClose, customer, sales = [], onDeleteSale, onEdit }) {
  if (!open || !customer) return null

  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(customer)
    }
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const matchedSales = (sales || []).filter((sale) => {
    const customerIdMatch = Boolean(customer.id && sale.customerId === customer.id)
    const nameMatch = Boolean(customer.name && sale.customerName && sale.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
    const phoneMatch = Boolean(customer.phone && sale.customerPhone && sale.customerPhone.trim() === customer.phone.trim())

    return (nameMatch && phoneMatch) || (customerIdMatch && phoneMatch)
  })

  const totalSpend = matchedSales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-4xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Customer profile</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{customer.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              title="Edit customer"
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contact details</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Name:</span> {customer.name || '—'}</p>
                <p><span className="font-semibold text-slate-900">Phone:</span> {customer.phone || '—'}</p>
                <p><span className="font-semibold text-slate-900">Address:</span> {customer.address || '—'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Orders</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{matchedSales.length > 0 ? matchedSales.length : (customer.orders || 0)}</p>
              </div>
              <div className="rounded-3xl bg-sky-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Total spend</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(matchedSales.length > 0 ? totalSpend : (customer.totalPurchase || 0))}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last purchase</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{matchedSales[0]?.date || customer.lastPurchase || 'No purchases yet'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Purchase history</p>
          {matchedSales.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No purchase history yet for this customer.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {matchedSales.map((sale) => {
                const items = getSaleItems(sale)
                return (
                  <div key={sale.id || sale.invoice} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{sale.invoice || sale.id}</p>
                        <p className="text-sm text-slate-500">{sale.date || sale.createdAt || 'Unknown date'}</p>
                        <p className="text-sm text-slate-500">{sale.time ? `${sale.time}` : ''}</p>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <p>{sale.paymentMethod || 'Cash'} · {sale.paymentPlan || 'Full'}</p>
                        <p className="font-semibold text-slate-900">{formatCurrency(sale.total || sale.amount || 0)}</p>
                        <p className="text-xs text-slate-500">{sale.paymentStatus || 'Paid'}{sale.dueAmount > 0 ? ` · Due Rs ${Number(sale.dueAmount).toLocaleString()}` : ''}</p>
                      </div>
                      <button
                          type="button"
                          onClick={() => printSaleSlip(sale)}
                          className="rounded-2xl bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="Print this order slip"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadSaleSlipFile(sale)}
                          className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                          title="Download this order slip"
                        >
                          <Download size={16} />
                        </button>
                        {onDeleteSale && (
                          <button
                            type="button"
                            onClick={() => onDeleteSale(sale.id)}
                            className="rounded-2xl bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            title="Delete this order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                    <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                      <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="bg-slate-100 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <tr>
                            <th className="px-3 py-3">Product</th>
                            <th className="px-3 py-3">Qty</th>
                            <th className="px-3 py-3">Price</th>
                            <th className="px-3 py-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={`${sale.id || sale.invoice}-${item.productId || index}`} className={index % 2 === 0 ? 'bg-slate-50' : ''}>
                              <td className="px-3 py-3 font-medium text-slate-900">{item.name || 'Unknown product'}</td>
                              <td className="px-3 py-3">{item.quantity || 0}</td>
                              <td className="px-3 py-3">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-3 py-3 font-semibold text-slate-900">{formatCurrency(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
