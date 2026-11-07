import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import AdminPOSPage from '../admin/POS'
import { useAuth } from '../../context/AuthContext'

export default function SalesPOSPage() {
  const { appData, currentUser } = useAuth()
  const canAccessPOS = useMemo(() => {
    if (currentUser?.role !== 'salesman') return true
    return appData?.settings?.users?.salesmanCanAccessPOS !== false
  }, [appData?.settings?.users, currentUser?.role])

  if (!canAccessPOS) {
    return <Navigate to="/sales/dashboard" replace />
  }

  return <AdminPOSPage />
}
