'use client'

import dynamic from 'next/dynamic'

const LeadsInbox = dynamic(() => import('@/admin/LeadsInbox'), { ssr: false })

export default function AdminLeadsPage() {
  return <LeadsInbox />
}
