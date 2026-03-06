import LoanService from '@/pages/LoanService'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export const metadata = {
  title: 'ปลดล็อคชีวิตการเงินด้วยอสังหาฯ | SPS Property Solution',
  description: 'เปลี่ยนหนี้บัตรหลายใบเป็นบ้านหลังเดียว ผ่อนถูกลงครึ่งต่อครึ่ง ปิดหนี้ให้ก่อน ไม่ผ่านคืนเงินจอง',
  alternates: { canonical: SITE_URL + '/loan-services' },
  openGraph: {
    title: 'ปลดล็อคชีวิตการเงินด้วยอสังหาฯ | SPS Property Solution',
    description: 'เปลี่ยนหนี้บัตรหลายใบเป็นบ้านหลังเดียว ผ่อนถูกลงครึ่งต่อครึ่ง',
    url: SITE_URL + '/loan-services',
  },
}

export default function LoanServicePage() {
  return <LoanService />
}
