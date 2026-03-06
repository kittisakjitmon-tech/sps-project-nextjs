'use client'

import dynamic from 'next/dynamic'

const PropertyListPage = dynamic(() => import('@/admin/PropertyListPage'), { ssr: false })

export default function AdminPropertiesPage() {
  return <PropertyListPage />
}
