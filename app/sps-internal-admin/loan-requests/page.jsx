'use client'

import dynamic from 'next/dynamic'

const AdminLoanRequests = dynamic(() => import('@/admin/AdminLoanRequests'), { ssr: false })

export default function AdminLoanRequestsPage() {
  return <AdminLoanRequests />
}
