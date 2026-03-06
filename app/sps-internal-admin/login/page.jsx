'use client'

import dynamic from 'next/dynamic'

const Login = dynamic(() => import('@/admin/Login'), { ssr: false })

export default function AdminLoginPage() {
  return <Login />
}
