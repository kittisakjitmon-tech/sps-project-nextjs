'use client'

import dynamic from 'next/dynamic'

const HomepageSectionsAdmin = dynamic(() => import('@/admin/HomepageSectionsAdmin'), { ssr: false })

export default function AdminHomepageSectionsPage() {
  return <HomepageSectionsAdmin />
}
