'use client'

import dynamic from 'next/dynamic'

const Favorites = dynamic(() => import('@/pages/Favorites'), { ssr: false })

export default function FavoritesPage() {
  return <Favorites />
}
