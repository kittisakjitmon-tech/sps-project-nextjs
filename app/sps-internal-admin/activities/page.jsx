'use client'

import dynamic from 'next/dynamic'

const ActivityLogsPage = dynamic(() => import('@/admin/ActivityLogsPage'), { ssr: false })

export default function AdminActivitiesPage() {
  return <ActivityLogsPage />
}
