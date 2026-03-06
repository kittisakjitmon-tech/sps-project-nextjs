import './globals.css'
import nextDynamic from 'next/dynamic'
import { Prompt } from 'next/font/google'
import { NextProviders } from '@/components/NextProviders'
import ErrorBoundary from '@/components/ErrorBoundary'
import WebVitalsReporter from '@/components/WebVitalsReporter'

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-prompt',
})

const ClientOnlyRoot = nextDynamic(
  () => import('@/components/ClientOnlyRoot').then((m) => ({ default: m.ClientOnlyRoot })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-900" />
      </div>
    ),
  }
)

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'SPS Property Solution | บ้านคอนโดสวย อมตะซิตี้ ชลบุรี',
  description: 'SPS Property Solution บ้านคอนโดสวย อมตะซิตี้ ชลบุรี - ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณในอมตะซิตี้ ชลบุรี',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sps-property.web.app'),
  openGraph: {
    title: 'SPS Property Solution | บ้านคอนโดสวย อมตะซิตี้ ชลบุรี',
    description: 'ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณในอมตะซิตี้ ชลบุรี',
    locale: 'th_TH',
  },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SPS Property Solution',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: 'SPS Property Solution ให้บริการรับฝาก ซื้อ-ขาย-เช่า-จำนอง-ขายฝาก อสังหาริมทรัพย์ทุกประเภทในเขตพื้นที่ ชลบุรี ฉะเชิงเทรา ระยอง ปทุมธานี กทม.',
  telephone: '0955520801',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'เมืองชลบุรี',
    addressRegion: 'ชลบุรี',
    addressCountry: 'TH',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/icon.png" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={prompt.className} suppressHydrationWarning>
        <WebVitalsReporter />
        <ErrorBoundary>
          <NextProviders>
            <ClientOnlyRoot>{children}</ClientOnlyRoot>
          </NextProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
