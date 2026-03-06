'use client'

import dynamic from 'next/dynamic'

const PropertyForm = dynamic(() => import('@/admin/PropertyForm'), { ssr: false })

export default function AdminPropertyNewPage() {
  return <PropertyForm />
}
