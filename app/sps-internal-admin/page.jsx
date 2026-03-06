'use client'

import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/admin/Dashboard'), { ssr: false })

export default function AdminDashboardPage() {
  return <Dashboard />
}
