import { useMemo, useState } from 'react'
import { Plus, Printer, Download } from 'lucide-react'
import { downloadCustomersReportFile, printCustomersReport } from '../../utils/exportCustomers'
import { mergeCustomers } from '../../utils/customers'
import { useAuth } from '../../context/AuthContext'
import CustomerSearch from '../../components/shared/customers/CustomerSearch'
import CustomerTable from '../../components/shared/customers/CustomerTable'
import CustomerForm from '../../components/shared/customers/CustomerForm'
import CustomerDetailsModal from '../../components/shared/customers/CustomerDetailsModal'
import CustomerSlipModal from '../../components/shared/customers/CustomerSlipModal'
import DeleteCustomerModal from '../../components/shared/customers/DeleteCustomerModal'

const emptyCustomer = {
  name: '',
  company: '',
  address: '',
  phone: '',
  email: '',
  notes: '',
}

export default function CustomersPage() {
  const { appData, setAppData } = useAuth()
  const customers = appData.customers || []
  const sales = appData.sales || []
  const actualCustomers = useMemo(() => customers.filter((customer) => !customer.isSnapshot), [customers])
  const mergedCustomers = useMemo(() => mergeCustomers(actualCustomers, sales), [actualCustomers, sales])

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customerDraft, setCustomerDraft] = useState(emptyCustomer)
  const [formErrors, setFormErrors] = useState({})
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [slipCustomer, setSlipCustomer] = useState(null)
  const [deleteCustomer, setDeleteCustomer] = useState(null)

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return mergedCustomers

    return mergedCustomers.filter((customer) => {
      const haystack = [customer.name, customer.company, customer.address, customer.phone, customer.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [mergedCustomers, search])

  const validate = (draft) => {
    const nextErrors = {}
    if (!draft.name?.trim()) nextErrors.name = 'Customer name is required.'
    if (!draft.address?.trim()) nextErrors.address = 'Customer address is required.'

    const phoneDigits = (draft.phone || '').replace(/\D/g, '')
    if (!draft.phone?.trim()) {
      nextErrors.phone = 'Customer phone number is required.'
    } else if (phoneDigits.length !== 11) {
      nextErrors.phone = 'Phone number must be exactly 11 digits.'
    }

    if (!editingCustomer && draft.name?.trim() && draft.phone?.trim()) {
      const cleanDraftName = draft.name.trim().toLowerCase()
      const cleanDraftPhone = draft.phone.trim()
      const duplicate = customers.find(
        (c) => c.name?.trim().toLowerCase() === cleanDraftName && c.phone?.trim() === cleanDraftPhone
      )
      if (duplicate) {
        nextErrors.phone = 'A customer with this exact name and phone number already exists.'
      }
    }

    if (draft.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCustomer(null)
    setCustomerDraft(emptyCustomer)
    setFormErrors({})
  }

  const openCreateForm = () => {
    setEditingCustomer(null)
    setCustomerDraft(emptyCustomer)
    setFormErrors({})
    setShowForm(true)
  }

  const openEditForm = (customer) => {
    setEditingCustomer(customer)
    setCustomerDraft({
      id: customer.id,
      name: customer.name || '',
      company: customer.company || '',
      address: customer.address || '',
      phone: customer.phone || '',
      email: customer.email || '',
      notes: customer.notes || '',
    })
    setFormErrors({})
    setShowForm(true)
  }

  const handleDraftChange = (changes) => {
    setCustomerDraft((prev) => ({ ...prev, ...changes }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate(customerDraft)) return

    const now = new Date()
    const payload = {
      ...customerDraft,
      name: customerDraft.name.trim(),
      address: customerDraft.address.trim(),
      phone: customerDraft.phone.trim(),
      email: customerDraft.email?.trim() || '',
      company: customerDraft.company?.trim() || '',
      notes: customerDraft.notes?.trim() || '',
      dateCreated: editingCustomer?.dateCreated || now.toLocaleDateString(),
      lastPurchase: editingCustomer?.lastPurchase || 'No purchase yet',
      orders: editingCustomer?.orders || 0,
      totalPurchase: editingCustomer?.totalPurchase || 0,
    }

    const persistCustomer = (prev) => {
      const existingIndex = (prev.customers || []).findIndex((item) => item.id === editingCustomer?.id)
      if (existingIndex >= 0) {
        return prev.customers.map((item) => (item.id === editingCustomer.id ? { ...item, ...payload } : item))
      }

      const nextCustomer = {
        ...payload,
        id: editingCustomer?.id || `customer_${Date.now()}`,
        dateCreated: editingCustomer?.dateCreated || now.toLocaleDateString(),
      }
      return [nextCustomer, ...(prev.customers || [])]
    }

    if (editingCustomer) {
      setAppData((prev) => ({
        ...prev,
        customers: persistCustomer(prev),
      }))
    } else {
      const nextCustomer = {
        ...payload,
        id: `customer_${Date.now()}`,
        dateCreated: now.toLocaleDateString(),
      }
      setAppData((prev) => ({
        ...prev,
        customers: [nextCustomer, ...(prev.customers || [])],
      }))
    }

    resetForm()
  }

  const handleDelete = () => {
    if (!deleteCustomer) return
    setAppData((prev) => ({
      ...prev,
      customers: prev.customers.filter((item) => item.id !== deleteCustomer.id),
    }))
    setDeleteCustomer(null)
  }

  const handleDeleteSale = (saleId) => {
    setAppData((prev) => ({
      ...prev,
      sales: (prev.sales || []).filter((s) => s.id !== saleId && s.invoice !== saleId),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-900">Customer orders</p>
          <p className="text-sm text-slate-500">All orders are available in each customer's details. Use the search to find customers.</p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Customers</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap items-center">
            <button
              type="button"
              onClick={() => downloadCustomersReportFile(filteredCustomers, sales)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 shadow-xs whitespace-nowrap"
              title="Download Customers Report"
            >
              <Download size={16} /> Download Report
            </button>
            <button
              type="button"
              onClick={() => printCustomersReport(filteredCustomers, sales)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 shadow-xs whitespace-nowrap"
              title="Print Customers Report"
            >
              <Printer size={16} /> Print Report
            </button>
            <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 whitespace-nowrap">{mergedCustomers.length} customers</span>
            <button type="button" onClick={openCreateForm} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 whitespace-nowrap">
              <Plus size={16} /> New customer
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Search customers</p>
            <p className="text-sm text-slate-500">Find a customer by name, contact details, or address.</p>
          </div>
          <div className="w-full md:w-80">
            <CustomerSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
          </div>
        </div>

        <CustomerTable customers={filteredCustomers} sales={sales} onView={setSelectedCustomer} onPrintSlip={setSlipCustomer} onEdit={openEditForm} onDelete={setDeleteCustomer} />
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{editingCustomer ? 'Edit customer' : 'Create customer'}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{editingCustomer ? 'Update customer profile' : 'Add a new shared customer'}</h3>
              </div>
              <button type="button" onClick={resetForm} className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">Close</button>
            </div>
            <div className="p-6">
              <CustomerForm customer={customerDraft} errors={formErrors} onChange={handleDraftChange} onSubmit={handleSubmit} onCancel={resetForm} mode={editingCustomer ? 'edit' : 'create'} />
            </div>
          </div>
        </div>
      ) : null}

      <CustomerDetailsModal open={Boolean(selectedCustomer)} onClose={() => setSelectedCustomer(null)} customer={selectedCustomer} sales={sales} onDeleteSale={handleDeleteSale} onEdit={openEditForm} />
      <CustomerSlipModal open={Boolean(slipCustomer)} onClose={() => setSlipCustomer(null)} customer={slipCustomer} sales={sales} />
      <DeleteCustomerModal open={Boolean(deleteCustomer)} onClose={() => setDeleteCustomer(null)} onConfirm={handleDelete} customer={deleteCustomer} />
    </div>
  )
}
