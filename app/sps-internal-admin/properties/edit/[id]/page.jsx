'use client'

import dynamic from 'next/dynamic'

const PropertyForm = dynamic(() => import('@/admin/PropertyForm'), { ssr: false })

export default function AdminPropertyEditPage({ params }) {
  return <PropertyForm />
}
