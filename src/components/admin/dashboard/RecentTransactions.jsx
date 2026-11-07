import { useMemo, useState } from 'react'

export default function RecentTransactions({ transactions = [] }) {
  const items = Array.isArray(transactions) ? transactions : []
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, currentPage])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">Recent Transactions</p>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Latest</p>
      </div>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No recent transactions yet.
          </div>
        ) : (
          <>
            {paginatedItems.map((transaction, idx) => {
              const amount = Number(transaction.amount || transaction.total || 0)
              const itemKey = transaction.id || `${transaction.description || 'sale'}-${transaction.date || 'date'}-${idx}`
              return (
                <div key={itemKey} className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">
                      {transaction.description || `Sale to ${transaction.customerName || 'Customer'}`}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">Rs {amount.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-slate-500">{transaction.date || 'Recent'}</p>
                </div>
              )
            })}

            {items.length > pageSize ? (
              <div className="flex items-center justify-center gap-3 pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-2xl font-bold text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ‹
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-2xl font-bold text-slate-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
