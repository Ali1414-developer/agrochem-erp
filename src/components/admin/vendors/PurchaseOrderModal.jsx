import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function PurchaseOrderModal({ open, vendors = [], products = [], selectedVendor = null, onClose, onConfirm }) {
  const [form, setForm] = useState({
    vendorId: '',
    productId: '',
    quantity: 0,
    purchasePrice: '',
    expectedDeliveryDate: '',
    paymentMethod: 'Cash',
    paymentPlan: 'Full',
    amountPaid: '',
    dueDate: '',
    dueTime: '',
    createNewProduct: false,
    newProductName: '',
    newProductCategory: '',
    newProductUnit: 'PCS',
  })

  const totalOrderPrice = Number(form.quantity || 0) * Number(form.purchasePrice || 0)

  const computedAmountPaid = form.paymentPlan === 'Full'
    ? totalOrderPrice
    : form.paymentPlan === 'Half'
    ? Number((totalOrderPrice / 2).toFixed(2))
    : Number(form.amountPaid || 0)

  const computedDueAmount = Number((totalOrderPrice - computedAmountPaid).toFixed(2))

  useEffect(() => {
    if (!open) {
      setForm({
        vendorId: selectedVendor?.id || '',
        productId: '',
        quantity: 0,
        purchasePrice: '',
        expectedDeliveryDate: '',
        paymentMethod: 'Cash',
        paymentPlan: 'Full',
        amountPaid: '',
        dueDate: '',
        dueTime: '',
        createNewProduct: false,
        newProductName: '',
        newProductCategory: '',
        newProductUnit: 'PCS',
      })
      return
    }
    if (selectedVendor?.id) {
      setForm((current) => ({
        ...current,
        vendorId: selectedVendor.id,
      }))
    }
  }, [open, selectedVendor])

  if (!open) return null

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = () => {
    if (!form.vendorId) {
      alert('Please select a vendor before creating the purchase order.')
      return
    }

    if (form.createNewProduct) {
      if (!form.newProductName.trim() || !form.newProductCategory.trim()) {
        alert('Enter the new product name and category to create a purchase order for a new item.')
        return
      }
    } else if (!form.productId) {
      alert('Please select an existing product or switch to create a new product.')
      return
    }

    if (!form.quantity || !form.purchasePrice) {
      alert('Quantity and expected purchase price are required to create the purchase order.')
      return
    }

    const total = Number(form.quantity) * Number(form.purchasePrice)
    const rawPaid = Number(form.amountPaid || 0)
    const amountPaid = form.paymentPlan === 'Full'
      ? total
      : form.paymentPlan === 'Half'
      ? Number((total / 2).toFixed(2))
      : rawPaid
    const dueAmount = Number((total - amountPaid).toFixed(2))

    if (form.paymentPlan === 'Other' && (Number.isNaN(rawPaid) || rawPaid <= 0)) {
      alert('Please enter a valid amount paid for Other payment plan.')
      return
    }
    if (amountPaid > total) {
      alert('Amount paid cannot exceed the total purchase amount.')
      return
    }
    if (dueAmount > 0 && (!form.dueDate || !form.dueTime)) {
      alert('Please enter a due date and time for the remaining payment.')
      return
    }

    onConfirm({
      ...form,
      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      vendorId: form.vendorId,
      total,
      amountPaid,
      dueAmount,
      paymentStatus: dueAmount > 0 ? 'Partial' : 'Paid',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Create purchase order</h3>
            <p className="mt-1 text-sm text-slate-500">Record stock received from the selected vendor.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">✕</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
            <span>Select vendor</span>
            <select
              value={form.vendorId}
              onChange={(e) => handleChange('vendorId', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Choose vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name} — {vendor.company}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
            <span>Product source</span>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                id="create-new-product"
                type="checkbox"
                checked={form.createNewProduct}
                onChange={(e) => handleChange('createNewProduct', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
              />
              <label htmlFor="create-new-product" className="text-sm text-slate-700">Create order for a new product that is not in the current catalog</label>
            </div>
          </label>

          {form.createNewProduct ? (
            <>
              <label className="space-y-2 text-sm text-slate-600">
                <span>New product name</span>
                <input
                  type="text"
                  value={form.newProductName}
                  onChange={(e) => handleChange('newProductName', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Enter product name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Category</span>
                <input
                  type="text"
                  value={form.newProductCategory}
                  onChange={(e) => handleChange('newProductCategory', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. Insecticide"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Unit</span>
                <input
                  type="text"
                  value={form.newProductUnit}
                  onChange={(e) => handleChange('newProductUnit', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="PCS / L / KG"
                />
              </label>
            </>
          ) : (
            <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
              <span>Select product</span>
              <select
                value={form.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Choose product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
          )}

          <label className="space-y-2 text-sm text-slate-600">
            <span>Quantity</span>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Purchase price</span>
            <input
              type="number"
              min="0"
              value={form.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Payment method</span>
            <select
              value={form.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Payment plan</span>
            <select
              value={form.paymentPlan}
              onChange={(e) => {
                const plan = e.target.value
                handleChange('paymentPlan', plan)
                if (plan === 'Full') {
                  handleChange('amountPaid', String(totalOrderPrice))
                } else if (plan === 'Half') {
                  handleChange('amountPaid', String(Number((totalOrderPrice / 2).toFixed(2))))
                } else {
                  handleChange('amountPaid', '')
                }
                handleChange('dueDate', '')
                handleChange('dueTime', '')
              }}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="Full">Full</option>
              <option value="Half">Half</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Amount paid now</span>
            <input
              type="number"
              min="0"
              value={form.paymentPlan === 'Other' ? form.amountPaid : String(computedAmountPaid)}
              onChange={(e) => handleChange('amountPaid', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder={form.paymentPlan === 'Full' ? String(totalOrderPrice) : form.paymentPlan === 'Half' ? String(Number((totalOrderPrice / 2).toFixed(2))) : 'Enter amount paid'}
              disabled={form.paymentPlan !== 'Other'}
            />
          </label>
          {(form.paymentPlan !== 'Full' && Number(totalOrderPrice) > 0) ? (
            <div className="space-y-2 text-sm text-slate-600">
              <p className="text-xs text-slate-500">Due amount: Rs {computedDueAmount.toLocaleString()}</p>
            </div>
          ) : null}
          <label className="space-y-2 text-sm text-slate-600">
            <span>Expected delivery date</span>
            <input
              type="date"
              value={form.expectedDeliveryDate}
              onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          {(form.paymentPlan !== 'Full') ? (
            <>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Due date</span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Due time</span>
                <input
                  type="time"
                  value={form.dueTime}
                  onChange={(e) => handleChange('dueTime', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
            </>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Cancel
          </button>
          <button type="button" onClick={submit} className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Confirm purchase
          </button>
        </div>
      </div>
    </div>
  )
}
