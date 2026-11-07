import { NavLink } from 'react-router-dom'
import { Home, Box, Layers, Tag, Truck, Users, ShieldCheck, CalendarDays, BarChart3, ShoppingBag, UserCircle2, Settings2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: Home },
  { name: 'POS', to: '/admin/pos', icon: ShoppingBag },
  { name: 'Products', to: '/admin/products', icon: Box },
  { name: 'Inventory', to: '/admin/inventory', icon: Layers },
  { name: 'Categories', to: '/admin/categories', icon: Tag },
  { name: 'Vendors', to: '/admin/vendors', icon: Truck },
  { name: 'Customers', to: '/admin/customers', icon: Users },
  { name: 'User Management', to: '/admin/users', icon: ShieldCheck },
  { name: 'Batch Expiry', to: '/admin/batch-expiry', icon: CalendarDays },
  { name: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', to: '/admin/settings', icon: Settings2 },
  { name: 'Profile', to: '/admin/profile', icon: UserCircle2 },
]

export default function AdminSidebar() {
  return (
    <div className="space-y-5">
      <div className="px-2">
        <p className="text-xs uppercase tracking-[0.32em] text-emerald-100">Admin navigation</p>
      </div>

      <nav className="space-y-1 px-2">
        {navigation.map((item) => (
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
        ))}
      </nav>
    </div>
  )
}
