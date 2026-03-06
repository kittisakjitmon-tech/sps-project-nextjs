'use client'

import dynamic from 'next/dynamic'

const UserManagement = dynamic(() => import('@/admin/UserManagement'), { ssr: false })

export default function AdminUsersPage() {
  return <UserManagement />
}
