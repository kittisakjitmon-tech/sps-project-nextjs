'use client'

import dynamic from 'next/dynamic'

const MyProperties = dynamic(() => import('@/admin/MyProperties'), { ssr: false })

export default function AdminMyPropertiesPage() {
  return <MyProperties />
}
