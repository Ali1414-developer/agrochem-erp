export function downloadInventoryFile(inventoryList = [], erpName = 'AgroChem ERP') {
  if (!inventoryList || inventoryList.length === 0) return

  const dateStr = new Date().toLocaleDateString()
  const fileName = `Inventory_Report_${Date.now()}.html`

  const rows = inventoryList.map((item) => {
    const qty = Number(item.qty || 0)
    let statusClass = 'color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0;'
    let statusText = 'In Stock'
    if (qty === 0) {
      statusClass = 'color: #be123c; background: #fff1f2; border: 1px solid #fecdd3;'
      statusText = 'Out of Stock'
    } else if (qty <= 10) {
      statusClass = 'color: #b45309; background: #fffbeb; border: 1px solid #fde68a;'
      statusText = 'Low Stock'
    }

    return `
      <tr>
        <td><strong>${item.productName || item.name || 'Unnamed'}</strong></td>
        <td><code style="font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${item.sku || '—'}</code></td>
        <td>${item.category || 'General'}</td>
        <td style="text-align: right; font-weight: 700;">${qty} ${item.unit || 'PCS'}</td>
        <td>${item.location || item.warehouse || 'Warehouse A'}</td>
        <td>${item.batchNumber || 'N/A'}</td>
        <td>${item.expiryDate || 'N/A'}</td>
        <td>${item.vendor || '—'}</td>
        <td><span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; ${statusClass}">${statusText}</span></td>
      </tr>
    `
  }).join('')

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Inventory Report - ${erpName}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #f8fafc; }
    .inventory-card { max-width: 950px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { margin: 0; color: #065f46; font-size: 24px; font-weight: 700; }
    .header p { margin: 4px 0 0 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .date-badge { background: #f1f5f9; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th { text-align: left; background: #f8fafc; padding: 12px 10px; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; }
    td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
    @media print {
      body { background: white; padding: 0; }
      .inventory-card { border: none; box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="inventory-card">
    <div class="header">
      <div>
        <h1>${erpName}</h1>
        <p>Warehouse Inventory & Stock Report</p>
      </div>
      <div class="date-badge">Total Items: ${inventoryList.length} · ${dateStr}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product / Item</th>
          <th>SKU</th>
          <th>Category</th>
          <th style="text-align: right;">Quantity</th>
          <th>Location</th>
          <th>Batch #</th>
          <th>Expiry Date</th>
          <th>Vendor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="footer">
      Generated on ${dateStr} · AgroChem ERP Warehouse System
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

export function printInventoryCatalog(inventoryList = [], erpName = 'AgroChem ERP') {
  if (!inventoryList || inventoryList.length === 0) return

  const dateStr = new Date().toLocaleDateString()
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const rows = inventoryList.map((item) => {
    const qty = Number(item.qty || 0)
    let statusText = 'In Stock'
    if (qty === 0) statusText = 'Out of Stock'
    else if (qty <= 10) statusText = 'Low Stock'

    return `
      <tr>
        <td><strong>${item.productName || item.name || 'Unnamed'}</strong></td>
        <td><code>${item.sku || '—'}</code></td>
        <td>${item.category || 'General'}</td>
        <td style="text-align: right; font-weight: 700;">${qty} ${item.unit || 'PCS'}</td>
        <td>${item.location || item.warehouse || 'Warehouse A'}</td>
        <td>${item.batchNumber || 'N/A'}</td>
        <td>${item.expiryDate || 'N/A'}</td>
        <td>${item.vendor || '—'}</td>
        <td>${statusText}</td>
      </tr>
    `
  }).join('')

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Inventory Report - ${erpName}</title>
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
  <p>Warehouse Inventory Report · Total Items: ${inventoryList.length} · ${dateStr}</p>
  <table>
    <thead>
      <tr>
        <th>Product / Item</th>
        <th>SKU</th>
        <th>Category</th>
        <th style="text-align: right;">Quantity</th>
        <th>Location</th>
        <th>Batch #</th>
        <th>Expiry Date</th>
        <th>Vendor</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
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
