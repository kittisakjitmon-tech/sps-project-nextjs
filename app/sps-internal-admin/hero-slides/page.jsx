'use client'

import dynamic from 'next/dynamic'

const HeroSlidesAdmin = dynamic(() => import('@/admin/HeroSlidesAdmin'), { ssr: false })

export default function AdminHeroSlidesPage() {
  return <HeroSlidesAdmin />
}
