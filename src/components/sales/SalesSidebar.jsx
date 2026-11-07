import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Boxes, Package, ShoppingBag, Tags, Users, UserCircle2, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { name: 'Dashboard', to: '/sales/dashboard', icon: LayoutDashboard },
  { name: 'Point of Sale', to: '/sales/pos', icon: ShoppingBag, permission: 'salesmanCanAccessPOS' },
  { name: 'Inventory', to: '/sales/inventory', icon: Boxes },
  { name: 'Products', to: '/sales/products', icon: Package },
  { name: 'Categories', to: '/sales/categories', icon: Tags },
  { name: 'Customers', to: '/sales/customers', icon: Users },
  { name: 'Profile', to: '/sales/profile', icon: UserCircle2 },
]

export default function SalesSidebar() {
  const { currentUser, appData, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 px-1">
        <button
          type="button"
          onClick={() => navigate('/sales/profile')}
          className="group flex w-full items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-left backdrop-blur-md shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:bg-white/15 hover:border-white/30 focus:outline-none cursor-pointer"
          title="Go to Sales Profile"
        >
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 ring-2 ring-white/20 bg-emerald-700/80 text-xl font-bold text-white shadow-md transition-transform duration-200 group-hover:scale-105">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.fullName || 'Sales User'}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <span>
                  {(currentUser?.fullName || 'Sales')
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-emerald-400 border-2 border-emerald-800 shadow-xs" title="Online" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200 leading-tight mb-1">
              AGROCHEM ERP
            </span>
            <p className="truncate text-base font-bold text-white tracking-wide leading-tight group-hover:text-emerald-100 transition-colors">
              {currentUser?.fullName || 'Sales Portal'}
            </p>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 sales-sidebar-scroll">
        <div className="px-2">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-100">Sales navigation</p>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {navigation.map((item) => {
            if (currentUser?.role === 'salesman' && item.permission && !appData?.settings?.users?.[item.permission]) {
              return null
            }
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-[1.75rem] px-4 py-3 text-base font-semibold transition ${
                    isActive
                      ? 'bg-[#059669] text-white shadow-[0_10px_40px_-18px_rgba(5,150,105,0.25)]'
                      : 'text-emerald-50 hover:bg-[#047857]/30 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto px-2 pb-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-900/95 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )
}
