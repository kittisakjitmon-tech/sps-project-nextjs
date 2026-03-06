'use client'

import dynamic from 'next/dynamic'

const PublicLogin = dynamic(() => import('@/pages/PublicLogin'), { ssr: false })

export default function LoginPage() {
  return <PublicLogin />
}
