'use client'

import dynamic from 'next/dynamic'

const PostProperty = dynamic(() => import('@/pages/PostProperty'), { ssr: false })

export default function PostPropertyPage() {
  return <PostProperty />
}
