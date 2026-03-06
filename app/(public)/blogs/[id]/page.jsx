import { getBlogById } from '@/lib/firebase-admin'
import BlogDetail from '@/pages/BlogDetail'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const id = resolved?.id
  if (!id) return { title: 'บทความ | SPS Property Solution' }
  let blog = null
  try {
    blog = await getBlogById(id)
  } catch (e) {
    return { title: 'บทความ | SPS Property Solution' }
  }
  if (!blog || !blog.published) {
    return { title: 'ไม่พบบทความ | SPS Property Solution' }
  }
  const title = `${blog.title} | SPS Property Solution`
  const description = (blog.content || '').replace(/<[^>]+>/g, '').slice(0, 160) + '…'
  const url = `${SITE_URL}/blogs/${blog.id}`
  const ogImage = Array.isArray(blog.images) && blog.images[0]
    ? (blog.images[0].startsWith('http') ? blog.images[0] : `${SITE_URL}${blog.images[0]}`)
    : null
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default function BlogDetailPage({ params }) {
  return <BlogDetail />
}
