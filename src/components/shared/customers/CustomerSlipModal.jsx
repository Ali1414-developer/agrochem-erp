import { X, Printer, Download } from 'lucide-react'

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`
}

export function downloadCustomerSlipFile(customer, sales = [], erpName = 'AgroChem ERP') {
  if (!customer) return

  const matchedSales = (sales || []).filter((sale) => {
    const customerIdMatch = Boolean(customer.id && sale.customerId === customer.id)
    const nameMatch = Boolean(customer.name && sale.customerName && sale.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
    const phoneMatch = Boolean(customer.phone && sale.customerPhone && sale.customerPhone.trim() === customer.phone.trim())
    return (nameMatch && phoneMatch) || (customerIdMatch && phoneMatch)
  })

  const totalSpend = matchedSales.reduce((sum, s) => sum + Number(s.total || s.amount || 0), 0)
  const ordersCount = matchedSales.length || Number(customer.orders || 0)
  const dateStr = new Date().toLocaleDateString()
  const fileName = `Customer_Slip_${(customer.name || 'Customer').replace(/\s+/g, '_')}_${Date.now()}.html`

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Customer Slip - ${customer.name}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #0f172a; background: #f8fafc; }
    .slip-card { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
    .header h1 { margin: 0; color: #065f46; font-size: 24px; font-weight: 700; }
    .header p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 700; margin-bottom: 8px; margin-top: 15px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 20px; }
    .info-item { font-size: 13px; }
    .info-item span { font-weight: 600; color: #334155; }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .metric-box { padding: 15px; border-radius: 14px; text-align: center; }
    .metric-box.green { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; }
    .metric-box.blue { background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; }
    .metric-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .metric-box .val { font-size: 22px; font-weight: 800; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { text-align: left; background: #f1f5f9; padding: 10px; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
    .total-row { font-weight: 700; background: #f8fafc; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
    @media print {
      body { background: white; padding: 0; }
      .slip-card { border: none; box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="slip-card">
    <div class="header">
      <h1>${erpName}</h1>
      <p>Customer Purchase Slip & Account Statement</p>
    </div>

    <div class="section-title">Customer Details</div>
    <div class="info-grid">
      <div class="info-item"><span>Name:</span> ${customer.name || 'N/A'}</div>
      <div class="info-item"><span>Phone:</span> ${customer.phone || 'N/A'}</div>
      <div class="info-item"><span>Address:</span> ${customer.address || 'Over the counter'}</div>
      <div class="info-item"><span>Company:</span> ${customer.company || '—'}</div>
    </div>

    <div class="metrics-grid">
      <div class="metric-box green">
        <div class="label">Total Orders</div>
        <div class="val">${ordersCount}</div>
      </div>
      <div class="metric-box blue">
        <div class="label">Total Spend</div>
        <div class="val">Rs ${totalSpend.toLocaleString()}</div>
      </div>
    </div>

    <div class="section-title">Payment Plan Summary</div>
    <div class="info-grid" style="margin-bottom: 20px;">
      <div class="info-item"><span>Plan:</span> ${matchedSales[0]?.paymentPlan || 'Full'}</div>
      <div class="info-item"><span>Status:</span> ${matchedSales[0]?.paymentStatus || 'Paid'}</div>
      <div class="info-item"><span>Due amount:</span> Rs ${Number(matchedSales[0]?.dueAmount || 0).toLocaleString()}</div>
      <div class="info-item"><span>Due date/time:</span> ${matchedSales[0]?.dueDate || 'N/A'}${matchedSales[0]?.dueTime ? ` ${matchedSales[0].dueTime}` : ''}</div>
    </div>

    <div class="section-title">Order History Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Date</th>
          <th>Payment</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${matchedSales.length > 0 ? matchedSales.map((sale) => `
          <tr>
            <td><strong>${sale.invoice || sale.id}</strong></td>
            <td>${sale.date || 'N/A'}</td>
            <td>${sale.paymentMethod || 'Cash'}</td>
            <td style="text-align: right; font-weight: 600;">Rs ${Number(sale.total || sale.amount || 0).toLocaleString()}</td>
          </tr>
        `).join('') : `
          <tr>
            <td colspan="4" style="text-align: center; color: #94a3b8;">No order history found.</td>
          </tr>
        `}
        <tr class="total-row">
          <td colspan="3"><strong>Total Account Purchases</strong></td>
          <td style="text-align: right; color: #047857; font-weight: 800;">Rs ${totalSpend.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      Generated on ${dateStr} · Thank you for your business!
    </div>
  </div>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function CustomerSlipModal({ open, onClose, customer, sales = [], erpName = 'AgroChem ERP' }) {
  if (!open || !customer) return null

  const matchedSales = (sales || []).filter((sale) => {
    const customerIdMatch = Boolean(customer.id && sale.customerId === customer.id)
    const nameMatch = Boolean(customer.name && sale.customerName && sale.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
    const phoneMatch = Boolean(customer.phone && sale.customerPhone && sale.customerPhone.trim() === customer.phone.trim())
    return (nameMatch && phoneMatch) || (customerIdMatch && phoneMatch)
  })

  const totalSpend = matchedSales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)
  const ordersCount = matchedSales.length || Number(customer.orders || 0)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    downloadCustomerSlipFile(customer, sales, erpName)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold">Print & Download Statement</p>
            <h3 className="text-lg font-bold text-slate-950">Customer Purchase Slip</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
            <X size={16} />
          </button>
        </div>

        <div id="printable-customer-slip" className="my-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="text-center border-b border-emerald-500/20 pb-3 mb-4">
            <h4 className="text-xl font-bold text-emerald-800">{erpName}</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Customer Account Statement</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/60 mb-4">
            <div><span className="text-slate-400 font-medium">Customer:</span> <strong className="text-slate-900">{customer.name}</strong></div>
            <div><span className="text-slate-400 font-medium">Phone:</span> <strong className="text-slate-900">{customer.phone || 'N/A'}</strong></div>
            <div><span className="text-slate-400 font-medium">Company:</span> <strong className="text-slate-900">{customer.company || '—'}</strong></div>
            <div><span className="text-slate-400 font-medium">Address:</span> <strong className="text-slate-900">{customer.address || 'Over the counter'}</strong></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Orders</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{ordersCount}</p>
            </div>
            <div className="bg-sky-50 border border-sky-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700">Total Spend</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalSpend)}</p>
            </div>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Breakdown</p>
          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-slate-100 text-slate-600 font-semibold">
                <tr>
                  <th className="p-2 text-left">Invoice</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Payment</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchedSales.length > 0 ? (
                  matchedSales.map((s) => (
                    <tr key={s.id}>
                      <td className="p-2 font-medium text-slate-900">{s.invoice || s.id}</td>
                      <td className="p-2 text-slate-500">{s.date || 'N/A'}</td>
                      <td className="p-2 text-slate-700">
                        <div className="font-semibold">{s.paymentMethod || 'Cash'}</div>
                        <div className="text-[11px] text-slate-500">
                          {s.paymentPlan || 'Full'} · {s.paymentStatus || 'Paid'}
                          {Number(s.dueAmount || 0) > 0 ? ` · Due Rs ${Number(s.dueAmount).toLocaleString()}${s.dueDate || s.dueTime ? ` on ${s.dueDate || ''}${s.dueTime ? ` ${s.dueTime}` : ''}` : ''}` : ''}
                        </div>
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900">{formatCurrency(s.total || s.amount || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-slate-400">No purchase records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200">
            Cancel
          </button>
          <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition shadow-xs">
            <Download size={15} /> Download Slip
          </button>
          <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs">
            <Printer size={15} /> Print Slip
          </button>
        </div>
      </div>
    </div>
  )
}
