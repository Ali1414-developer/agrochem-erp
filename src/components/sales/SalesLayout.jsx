import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import SalesSidebar from './SalesSidebar'

export default function SalesLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <div
          className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`sales-sidebar fixed inset-y-0 left-0 z-50 w-72 transform flex h-full flex-col border-r border-transparent px-4 py-6 text-white bg-linear-to-b from-emerald-700 to-emerald-800 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{
            background: `linear-gradient(180deg, #059669 0%, #047857 100%)`,
          }}
        >
          <SalesSidebar />
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              aria-label="Toggle sidebar"
            >
              <span className="text-xl font-semibold">☰</span>
            </button>
            <div className="text-lg font-semibold text-slate-950">Sales portal</div>
          </div>

          <div className="space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
