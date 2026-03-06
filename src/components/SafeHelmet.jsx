'use client'

import { Helmet } from 'react-helmet-async'

export function SafeHelmet(props) {
  if (typeof window === 'undefined') return null
  return <Helmet {...props} />
}
