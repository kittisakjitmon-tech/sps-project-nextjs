'use client'

import { useSystemSettings } from '@/hooks/useSystemSettings'
import MaintenancePage from '@/components/MaintenancePage'

function RouteLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-900 border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-500 text-sm font-medium">กำลังโหลด…</p>
    </div>
  )
}

export function PublicLayoutClient({ children }) {
  const { settings, loading } = useSystemSettings()

  if (loading) return <RouteLoading />
  if (settings.maintenanceMode) {
    return <MaintenancePage siteName={settings.siteName} />
  }

  return <>{children}</>
}
