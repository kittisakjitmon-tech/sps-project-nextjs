'use client'

import dynamic from 'next/dynamic'
import PublicProtectedRoute from '@/components/PublicProtectedRoute'

const Profile = dynamic(() => import('@/pages/Profile'), { ssr: false })

export default function ProfilePage() {
  return (
    <PublicProtectedRoute>
      <Profile />
    </PublicProtectedRoute>
  )
}
