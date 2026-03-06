import { getHomePageData } from '@/lib/firebase-admin'
import Home from '@/pages/Home'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export const metadata = {
  title: 'SPS Property Solution | บ้านคอนโดสวย อมตะซิตี้ ชลบุรี',
  description: 'SPS Property Solution บ้านคอนโดสวย อมตะซิตี้ ชลบุรี - ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณในอมตะซิตี้ ชลบุรี',
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: 'SPS Property Solution | บ้านคอนโดสวย อมตะซิตี้ ชลบุรี',
    description: 'ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณในอมตะซิตี้ ชลบุรี',
    url: SITE_URL + '/',
    locale: 'th_TH',
  },
}

export default async function HomePage() {
  let initialData = null
  try {
    initialData = await getHomePageData()
  } catch (e) {
    console.error('getHomePageData failed:', e?.message || e)
  }
  return <Home initialData={initialData} />
}
