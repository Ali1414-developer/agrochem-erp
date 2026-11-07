import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import BatchExpiryTable from '../../components/admin/batchExpiry/BatchExpiryTable'
import ExpiryFilters from '../../components/admin/batchExpiry/ExpiryFilters'
import BatchDetailsModal from '../../components/admin/batchExpiry/BatchDetailsModal'

function getStatus(expiryDate) {
  const now = new Date()
  const expiry = new Date(expiryDate)
  if (expiry < now) return 'expired'
  const days = Math.round((expiry - now) / (1000 * 60 * 60 * 24))
  if (days <= 45) return 'expiring'
  return 'safe'
}

function normalizeDate(value) {
  return new Date(value).getTime()
}

export default function BatchExpiryPage() {
  const { appData } = useAuth()
  const products = appData.products || []
  const inventory = appData.inventory || []

  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'expiryAsc' })
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const batchRecords = useMemo(() => {
    return inventory.map((item) => {
      const product = products.find((product) => product.id === item.productId) || {}
      const expiryDate = item.expiryDate || product.expiryDate || ''
      return {
        id: item.id,
        productId: item.productId,
        productName: product.name || item.productName || 'Unknown product',
        batchNumber: item.batchNumber || product.batchNumber || 'N/A',
        qty: Number(item.qty || 0),
        expiryDate,
        category: product.category || 'Uncategorized',
        description: product.description || '',
        vendor: product.vendor || '',
        location: item.location || item.warehouse || 'Unknown',
        status: getStatus(expiryDate),
      }
    })
  }, [inventory, products])

  const filteredBatches = useMemo(() => {
    return batchRecords
      .filter((batch) => {
        const query = filters.query.trim().toLowerCase()
        const matchesQuery =
          !query ||
          batch.productName.toLowerCase().includes(query) ||
          batch.batchNumber.toLowerCase().includes(query) ||
          batch.category.toLowerCase().includes(query)
        const matchesStatus = filters.status === 'all' || batch.status === filters.status
        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (filters.sort === 'expiryDesc') return normalizeDate(b.expiryDate) - normalizeDate(a.expiryDate)
        if (filters.sort === 'qtyDesc') return b.qty - a.qty
        return normalizeDate(a.expiryDate) - normalizeDate(b.expiryDate)
      })
  }, [batchRecords, filters])

  const openBatchModal = (batch) => {
    setSelectedBatch(batch)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/25">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Batch expiry</p>
            <h1 className="text-3xl font-semibold text-slate-950">Inventory expiry monitoring</h1>
          </div>
        </div>
      </div>

      <ExpiryFilters filters={filters} onChange={setFilters} />

      <BatchExpiryTable batches={filteredBatches} onView={openBatchModal} />

      <BatchDetailsModal open={modalOpen} batch={selectedBatch} onClose={() => setModalOpen(false)} />
    </div>
  )
}
