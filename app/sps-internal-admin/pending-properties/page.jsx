'use client'

import dynamic from 'next/dynamic'

const PendingProperties = dynamic(() => import('@/admin/PendingProperties'), { ssr: false })

export default function AdminPendingPropertiesPage() {
  return <PendingProperties />
}
