import { PublicLayoutClient } from '@/components/PublicLayoutClient'

export const dynamic = 'force-dynamic'

export default function PublicLayout({ children }) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>
}
