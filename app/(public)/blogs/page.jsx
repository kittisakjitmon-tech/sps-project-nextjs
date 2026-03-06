import Blogs from '@/pages/Blogs'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export const metadata = {
  title: 'บทความอสังหาริมทรัพย์และบ้าน | SPS Property Solution',
  description: 'อ่านบทความและสาระน่ารู้เกี่ยวกับอสังหาริมทรัพย์ บ้าน ทาวน์โฮม คอนโด การกู้สินเชื่อ และเคล็ดลับการลงทุนจาก SPS Property Solution',
  alternates: { canonical: SITE_URL + '/blogs' },
  openGraph: {
    title: 'บทความอสังหาริมทรัพย์และบ้าน | SPS Property Solution',
    description: 'อ่านบทความและสาระน่ารู้เกี่ยวกับอสังหาริมทรัพย์ บ้าน คอนโด การกู้สินเชื่อ',
    url: SITE_URL + '/blogs',
  },
}

export default function BlogsPage() {
  return <Blogs />
}
