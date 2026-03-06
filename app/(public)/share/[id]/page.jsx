import { getShareLinkByToken, getPropertyById } from '@/lib/firebase-admin'
import SharePage from '@/pages/SharePage'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spspropertysolution.com'

function isShareLinkExpired(shareLink) {
  if (!shareLink?.expiresAt) return true
  const ms = typeof shareLink.expiresAt === 'string'
    ? new Date(shareLink.expiresAt).getTime()
    : shareLink.expiresAt?.seconds != null
      ? shareLink.expiresAt.seconds * 1000
      : 0
  return ms <= Date.now()
}

function getOgImageUrl(property) {
  const raw = Array.isArray(property?.images) && property.images.length > 0
    ? property.images[0]
    : null
  if (!raw) return `${SITE_URL}/share-default.jpg`
  return raw.startsWith('http') ? raw : `${SITE_URL}${raw}`
}

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const token = resolved?.id
  if (!token) return { title: 'แชร์ทรัพย์สิน | SPS Property Solution' }
  let shareLink = null
  let property = null
  try {
    shareLink = await getShareLinkByToken(token)
    if (shareLink && !isShareLinkExpired(shareLink)) {
      property = await getPropertyById(shareLink.propertyId)
    }
    if (!property && shareLink) {
      property = await getPropertyById(token)
    }
  } catch (e) {
    // ignore
  }
  if (!property) {
    return {
      title: 'แชร์ทรัพย์สิน | SPS Property Solution',
      description: 'ลิงก์แชร์อสังหาริมทรัพย์จาก SPS Property Solution',
    }
  }
  const title = `${property.title} | SPS Property Solution`
  const description = (property.description || '').slice(0, 160) + ((property.description || '').length > 160 ? '…' : '')
  const url = `${SITE_URL}/share/${token}`
  const ogImage = getOgImageUrl(property)
  return {
    title,
    description,
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

export default async function SharePageRoute({ params }) {
  const resolved = typeof params?.then === 'function' ? await params : params
  const token = resolved?.id
  let initialShareData = null
  if (token) {
    try {
      const shareLink = await getShareLinkByToken(token)
      if (shareLink) {
        if (isShareLinkExpired(shareLink)) {
          initialShareData = { property: null, expired: true }
        } else {
          const property = await getPropertyById(shareLink.propertyId)
          initialShareData = { property, expired: false }
        }
      } else {
        const fallback = await getPropertyById(token)
        initialShareData = { property: fallback, expired: false }
      }
    } catch (e) {
      // ignore
    }
  }
  return <SharePage initialShareData={initialShareData} />
}
