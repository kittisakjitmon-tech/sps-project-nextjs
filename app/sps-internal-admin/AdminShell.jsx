'use client'

import { usePathname } from 'next/navigation'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import AdminLayout from '@/admin/AdminLayout'

export function AdminShell({ children }) {
  const pathname = usePathname()
  const isLogin = pathname === '/sps-internal-admin/login' || pathname?.endsWith('/login')

  return (
    <AdminAuthProvider>
      {isLogin ? children : (
        <AdminProtectedRoute>
          <AdminLayout>{children}</AdminLayout>
        </AdminProtectedRoute>
      )}
    </AdminAuthProvider>
  )
}
