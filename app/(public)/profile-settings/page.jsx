'use client'

import dynamic from 'next/dynamic'
import PublicProtectedRoute from '@/components/PublicProtectedRoute'

const ProfileSettings = dynamic(() => import('@/pages/ProfileSettings'), { ssr: false })

export default function ProfileSettingsPage() {
  return (
    <PublicProtectedRoute>
      <ProfileSettings />
    </PublicProtectedRoute>
  )
}
