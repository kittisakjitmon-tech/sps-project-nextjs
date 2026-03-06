import { AdminShell } from './AdminShell'

export const dynamic = 'force-dynamic'

export default function AdminRootLayout({ children }) {
  return <AdminShell>{children}</AdminShell>
}
