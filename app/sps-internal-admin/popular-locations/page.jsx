'use client'

import dynamic from 'next/dynamic'

const PopularLocationsAdmin = dynamic(() => import('@/admin/PopularLocationsAdmin'), { ssr: false })

export default function AdminPopularLocationsPage() {
  return <PopularLocationsAdmin />
}
