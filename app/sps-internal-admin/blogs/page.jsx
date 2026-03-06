'use client'

import dynamic from 'next/dynamic'

const AdminBlogs = dynamic(() => import('@/admin/AdminBlogs'), { ssr: false })

export default function AdminBlogsPage() {
  return <AdminBlogs />
}
