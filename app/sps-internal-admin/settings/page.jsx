'use client'

import dynamic from 'next/dynamic'

const Settings = dynamic(() => import('@/admin/Settings'), { ssr: false })

export default function AdminSettingsPage() {
  return <Settings />
}
