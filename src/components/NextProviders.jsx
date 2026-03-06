'use client'

import { HelmetProvider } from 'react-helmet-async'
import { SearchProvider } from '@/context/SearchContext'
import { PublicAuthProvider } from '@/context/PublicAuthContext'

export function NextProviders({ children }) {
  return (
    <HelmetProvider>
      <SearchProvider>
        <PublicAuthProvider>
          {children}
        </PublicAuthProvider>
      </SearchProvider>
    </HelmetProvider>
  )
}
