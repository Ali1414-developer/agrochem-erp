import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Inventory from './pages/admin/Inventory'
import ProductsPage from './pages/admin/Products'
import CategoriesPage from './pages/admin/CategoriesPage'
import VendorsPage from './pages/admin/VendorsPage'
import CustomersPage from './pages/admin/Customers'
import UserManagement from './pages/admin/UserManagement'
import ReportsPage from './pages/admin/Reports'
import BatchExpiryPage from './pages/admin/BatchExpiry'
import SettingsPage from './pages/admin/Settings'
import ProfilePage from './pages/admin/Profile'
import POSPage from './pages/admin/POS'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleBasedRoute from './components/auth/RoleBasedRoute'
import SalesLayout from './components/sales/SalesLayout'
import SalesDashboard from './pages/sales/SalesDashboard'
import SalesInventory from './pages/sales/Inventory'
import SalesProducts from './pages/sales/Products'
import SalesPOS from './pages/sales/POS'
import SalesCategories from './pages/sales/Categories'
import SalesCustomers from './pages/sales/Customers'
import SalesProfile from './pages/sales/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedRoute allowedRoles={['admin']} fallbackPath="/sales/dashboard" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="batch-expiry" element={<BatchExpiryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="pos" element={<POSPage />} />
              </Route>
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['admin', 'salesman']} fallbackPath="/login" />}>
              <Route path="/sales" element={<SalesLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SalesDashboard />} />
                <Route path="inventory" element={<SalesInventory />} />
                <Route path="products" element={<SalesProducts />} />
                <Route path="pos" element={<SalesPOS />} />
                <Route path="categories" element={<SalesCategories />} />
                <Route path="customers" element={<SalesCustomers />} />
                <Route path="profile" element={<SalesProfile />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
