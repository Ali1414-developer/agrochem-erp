export function getCustomerMetrics(customer, sales = []) {
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

export function downloadCustomersReportFile(customersList = [], salesList = [], erpName = 'AgroChem ERP') {
  if (!customersList || customersList.length === 0) return

  const dateStr = new Date().toLocaleDateString()
  const fileName = `Customers_Report_${Date.now()}.html`

  let grandTotalSpend = 0
  let grandTotalOrders = 0

  const rows = customersList.map((customer) => {
    const metrics = getCustomerMetrics(customer, salesList)
    grandTotalSpend += metrics.totalPurchase
    grandTotalOrders += metrics.purchaseCount

    return `
      <tr>
        <td>
          <strong>${customer.name || 'Unnamed'}</strong>
          ${customer.company ? `<div style="font-size: 11px; color: #64748b;">${customer.company}</div>` : ''}
        </td>
        <td>
          <div>${customer.phone || '—'}</div>
          <div style="font-size: 11px; color: #64748b;">${customer.email || '—'}</div>
        </td>
        <td>${customer.address || '—'}</td>
        <td style="text-align: right; font-weight: 700;">${metrics.purchaseCount}</td>
        <td style="text-align: right; color: #047857; font-weight: 700;">Rs ${metrics.totalPurchase.toLocaleString()}</td>
        <td>${metrics.lastPurchase}</td>
      </tr>
    `
  }).join('')

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Customers Report - ${erpName}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #f8fafc; }
    .report-card { max-width: 950px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { margin: 0; color: #065f46; font-size: 24px; font-weight: 700; }
    .header p { margin: 4px 0 0 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .date-badge { background: #f1f5f9; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #475569; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .summary-box { padding: 12px 16px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
    .summary-box .lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .summary-box .val { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th { text-align: left; background: #f8fafc; padding: 12px 10px; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
    .total-row { font-weight: 700; background: #f8fafc; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
    @media print {
      body { background: white; padding: 0; }
      .report-card { border: none; box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="header">
      <div>
        <h1>${erpName}</h1>
        <p>Customer Database & Accounts Statement</p>
      </div>
      <div class="date-badge">Generated: ${dateStr}</div>
    </div>

    <div class="summary-grid">
      <div class="summary-box">
        <div class="lbl">Total Customers</div>
        <div class="val">${customersList.length}</div>
      </div>
      <div class="summary-box">
        <div class="lbl">Total Orders</div>
        <div class="val">${grandTotalOrders}</div>
      </div>
      <div class="summary-box">
        <div class="lbl">Total Revenue</div>
        <div class="val" style="color: #047857;">Rs ${grandTotalSpend.toLocaleString()}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Contact Info</th>
          <th>Address</th>
          <th style="text-align: right;">Orders</th>
          <th style="text-align: right;">Total Purchases</th>
          <th>Last Purchase</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="3"><strong>Grand Total (All Accounts)</strong></td>
          <td style="text-align: right;">${grandTotalOrders}</td>
          <td style="text-align: right; color: #047857; font-weight: 800;">Rs ${grandTotalSpend.toLocaleString()}</td>
          <td>—</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      Generated on ${dateStr} · AgroChem ERP System
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

export function printCustomersReport(customersList = [], salesList = [], erpName = 'AgroChem ERP') {
  if (!customersList || customersList.length === 0) return

  const dateStr = new Date().toLocaleDateString()
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  let grandTotalSpend = 0
  let grandTotalOrders = 0

  const rows = customersList.map((customer) => {
    const metrics = getCustomerMetrics(customer, salesList)
    grandTotalSpend += metrics.totalPurchase
    grandTotalOrders += metrics.purchaseCount

    return `
      <tr>
        <td><strong>${customer.name || 'Unnamed'}</strong> ${customer.company ? `(${customer.company})` : ''}</td>
        <td>${customer.phone || '—'} · ${customer.email || '—'}</td>
        <td>${customer.address || '—'}</td>
        <td style="text-align: right; font-weight: 700;">${metrics.purchaseCount}</td>
        <td style="text-align: right; font-weight: 700;">Rs ${metrics.totalPurchase.toLocaleString()}</td>
        <td>${metrics.lastPurchase}</td>
      </tr>
    `
  }).join('')

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Customers Report - ${erpName}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; color: #111; }
    h1 { margin: 0; font-size: 22px; color: #065f46; }
    p { margin: 4px 0 15px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 8px; border-bottom: 2px solid #000; font-size: 11px; text-transform: uppercase; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>${erpName}</h1>
  <p>Customers Database Report · Total Customers: ${customersList.length} · ${dateStr}</p>
  <table>
    <thead>
      <tr>
        <th>Customer Name</th>
        <th>Contact Info</th>
        <th>Address</th>
        <th style="text-align: right;">Orders</th>
        <th style="text-align: right;">Total Purchases</th>
        <th>Last Purchase</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr style="font-weight: 700;">
        <td colspan="3">Grand Total</td>
        <td style="text-align: right;">${grandTotalOrders}</td>
        <td style="text-align: right;">Rs ${grandTotalSpend.toLocaleString()}</td>
        <td>—</td>
      </tr>
    </tbody>
  </table>
  <script>
    window.onload = function() {
      window.print();
      window.close();
    };
  </script>
</body>
</html>`)
  printWindow.document.close()
}

export function getSaleInvoiceHTML(sale, erpName = 'AgroChem ERP') {
  const customer = sale.customer || {
    name: sale.customerName || 'N/A',
    phone: sale.customerPhone || 'N/A',
    address: sale.customerAddress || 'Over the counter',
    email: sale.customerEmail || '',
  }

  const items = Array.isArray(sale.products)
    ? sale.products.map((item) => ({
        name: item.name || item.productName || 'Unknown product',
        quantity: item.quantity || item.qty || 0,
        unitPrice: Number(item.price || item.unitPrice || 0),
        total: Number(item.total || item.totalPrice || (item.quantity || 0) * (item.price || item.unitPrice || 0)),
      }))
    : Array.isArray(sale.cart)
      ? sale.cart.map((item) => ({
          name: item.name || item.productName || 'Unknown product',
          quantity: item.quantity || item.qty || 0,
          unitPrice: Number(item.price || item.unitPrice || 0),
          total: Number(item.total || item.totalPrice || (item.quantity || 0) * (item.price || item.unitPrice || 0)),
        }))
      : []

  const totalAmount = Number(sale.total || sale.amount || 0)
  const date = sale.date || new Date().toLocaleDateString()
  const time = sale.time || ''
  const invoice = sale.invoice || sale.id || 'N/A'
  const paymentMethod = sale.paymentMethod || 'Cash'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sale Slip - ${invoice}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #0f172a; background: #f8fafc; }
    .card { max-width: 700px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
    .header h1 { margin: 0; color: #065f46; font-size: 24px; font-weight: 700; }
    .header p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 20px 0; }
    .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; font-weight: 700; margin-bottom: 6px; }
    .value { font-size: 14px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { text-align: left; background: #f1f5f9; padding: 10px; color: #475569; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
    td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
    .total { font-weight: 700; }
    .footer { margin-top: 25px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
    @media print { body { background: white; padding: 0; } .card { border: none; box-shadow: none; max-width: 100%; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${erpName}</h1>
      <p>Sale Slip</p>
    </div>

    <div class="grid">
      <div>
        <div class="label">Invoice</div>
        <div class="value">${invoice}</div>
      </div>
      <div>
        <div class="label">Date</div>
        <div class="value">${date} ${time ? ` ${time}` : ''}</div>
      </div>
      <div>
        <div class="label">Payment</div>
        <div class="value">${paymentMethod}</div>
      </div>
      <div>
        <div class="label">Payment plan</div>
        <div class="value">${sale.paymentPlan || 'Full'}</div>
      </div>
      <div>
        <div class="label">Status</div>
        <div class="value">${sale.paymentStatus || (totalAmount > 0 ? 'Paid' : 'Pending')}</div>
      </div>
      <div>
        <div class="label">Paid amount</div>
        <div class="value">Rs ${Number(sale.amountPaid || sale.total || 0).toLocaleString()}</div>
      </div>
    </div>

    ${Number(sale.dueAmount || 0) > 0 ? `
      <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 20px 0;">
        <div>
          <div class="label">Due amount</div>
          <div class="value">Rs ${Number(sale.dueAmount).toLocaleString()}</div>
        </div>
        <div>
          <div class="label">Due date/time</div>
          <div class="value">${sale.dueDate || 'N/A'}${sale.dueTime ? ` ${sale.dueTime}` : ''}</div>
        </div>
      </div>
    ` : ''}

    <div class="grid">
      <div>
        <div class="label">Customer</div>
        <div class="value">${customer.name}</div>
      </div>
      <div>
        <div class="label">Phone</div>
        <div class="value">${customer.phone}</div>
      </div>
      <div>
        <div class="label">Address</div>
        <div class="value">${customer.address}</div>
      </div>
      <div>
        <div class="label">Email</div>
        <div class="value">${customer.email || '—'}</div>
      </div>
    </div>

    <div class="label">Order items</div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>Rs ${item.unitPrice.toLocaleString()}</td>
            <td style="text-align: right;">Rs ${item.total.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total">
          <td colspan="3">Grand total</td>
          <td style="text-align: right;">Rs ${totalAmount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">Generated by ${erpName}</div>
  </div>
</body>
</html>`
}

export function downloadSaleSlipFile(sale, erpName = 'AgroChem ERP') {
  if (!sale) return
  const htmlContent = getSaleInvoiceHTML(sale, erpName)
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `Sale_Slip_${(sale.invoice || sale.id || 'order').replace(/\s+/g, '_')}.html`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printSaleSlip(sale, erpName = 'AgroChem ERP') {
  if (!sale) return
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  printWindow.document.write(getSaleInvoiceHTML(sale, erpName))
  printWindow.document.close()
  printWindow.focus()
  printWindow.onload = function () {
    printWindow.print()
  }
}
