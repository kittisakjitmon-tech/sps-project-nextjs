import { getPropertyById } from '@/lib/firebase-admin'
import PropertyDetail from '@/pages/PropertyDetail'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

function getOgImageUrl(property) {
  const raw = Array.isArray(property?.images) && property.images.length > 0
    ? property.images[0]
    : null
  if (!raw) return `${SITE_URL}/share-default.jpg`
  return raw.startsWith('http') ? raw : `${SITE_URL}${raw}`
}

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const id = resolved?.id
  if (!id) return { title: 'ทรัพย์สิน | SPS Property Solution' }
  let property = null
  try {
    property = await getPropertyById(id)
  } catch (e) {
    return { title: 'ทรัพย์สิน | SPS Property Solution' }
  }
  if (!property) return { title: 'ไม่พบรายการ | SPS Property Solution' }
  const title = `${property.title} | SPS Property Solution`
  const description = (property.description || '').slice(0, 160) + ((property.description || '').length > 160 ? '…' : '')
  const url = `${SITE_URL}/properties/${property.id}`
  const ogImage = getOgImageUrl(property)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PropertyDetailPage({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const id = resolved?.id
  let initialProperty = null
  if (id) {
    try {
      initialProperty = await getPropertyById(id)
    } catch (e) {
      // ignore
    }
  }
  return <PropertyDetail initialProperty={initialProperty} />
}
