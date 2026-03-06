import { getPropertiesList } from '@/lib/firebase-admin'
import Properties from '@/pages/Properties'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export const metadata = {
  title: 'ค้นหาทรัพย์สิน | SPS Property Solution',
  description: 'ค้นหาบ้าน คอนโด ทาวน์โฮม ขาย-เช่า ในอมตะซิตี้ ชลบุรี และพื้นที่ใกล้เคียง จาก SPS Property Solution',
  alternates: { canonical: SITE_URL + '/properties' },
  openGraph: {
    title: 'ค้นหาทรัพย์สิน | SPS Property Solution',
    description: 'ค้นหาบ้าน คอนโด ทาวน์โฮม ขาย-เช่า ในอมตะซิตี้ ชลบุรี',
    url: SITE_URL + '/properties',
  },
}

export default async function PropertiesPage() {
  let initialProperties = null
  try {
    initialProperties = await getPropertiesList({ availableOnly: false, limitCount: 100 })
  } catch (e) {
    console.error('getPropertiesList failed:', e?.message || e)
  }
  return <Properties initialProperties={initialProperties} />
}
