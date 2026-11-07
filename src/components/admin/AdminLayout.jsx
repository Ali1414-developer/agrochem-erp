import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const { currentUser, appData, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 })
  }, [location.pathname])

  const settings = appData?.settings || {}
  const general = settings.general || {}
  const appearance = settings.appearance || {}
  const primaryColor = appearance.primaryColor || '#059669'

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPath = location.pathname.replace('/admin/', '').replace('-', ' ') || 'dashboard'
  const currentTitle = currentPath === 'dashboard' ? 'Dashboard' : `${currentPath.charAt(0).toUpperCase()}${currentPath.slice(1)}`

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const initials = (currentUser?.fullName || 'Admin')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row overflow-hidden lg:overflow-hidden">
        <div
          className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 transform flex h-full flex-col border-r border-transparent px-4 py-6 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor} 100%)` }}
        >
          <button
            type="button"
            onClick={() => navigate('/admin/profile')}
            className="group mb-6 flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-left backdrop-blur-md shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
            title="Go to Admin Profile"
          >
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 ring-2 ring-white/20 bg-emerald-700/80 text-xl font-bold text-white shadow-md transition-transform duration-200 group-hover:scale-105">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser?.fullName || 'User avatar'}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-emerald-400 border-2 border-emerald-800 shadow-xs" title="Online" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200 leading-tight mb-1">
                {general.erpName || 'AgroChem ERP'}
              </span>
              <p className="truncate text-sm text-emerald-100 leading-tight mb-1">
                {general.businessName || 'AgroChem Pesticides'}
              </p>
              <p className="truncate text-base font-bold text-white tracking-wide leading-tight group-hover:text-emerald-100 transition-colors">
                {currentUser?.fullName || 'System Admin'}
              </p>
            </div>
          </button>

          <div className="admin-sidebar-scroll flex-1 overflow-y-auto pr-2 pb-6">
            <AdminSidebar />
          </div>

          <div className="sticky bottom-0 mt-auto px-2 pb-4">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-start gap-2 whitespace-nowrap rounded-[1.75rem] bg-[#059669] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#047857] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 lg:ml-64">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-lg font-semibold text-slate-950">{currentTitle}</div>
          </div>

          <div className="space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
