import Contact from '@/pages/Contact'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export const metadata = {
  title: 'ติดต่อเรา | SPS Property Solution - บ้านคอนโดสวย อมตะซิตี้ ชลบุรี',
  description: 'ติดต่อ SPS Property Solution บ้านคอนโดสวย อมตะซิตี้ ชลบุรี - โทร 0955520801 หรือส่งข้อความ',
  alternates: { canonical: SITE_URL + '/contact' },
  openGraph: {
    title: 'ติดต่อเรา | SPS Property Solution',
    url: SITE_URL + '/contact',
  },
}

export default function ContactPage() {
  return <Contact />
}
