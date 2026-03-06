/**
 * Firebase Admin SDK — server-only. Use for SSR/SSG data (getHomePageData, getPropertyById, etc.)
 * Do not import this module in client components or pages that run in the browser.
 */

import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const PROPERTIES = 'properties'
const POPULAR_LOCATIONS = 'popular_locations'
const HOMEPAGE_SECTIONS = 'homepage_sections'
const BLOGS = 'blogs'
const SHARE_LINKS = 'share_links'

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]
  }
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS
  let credential = null
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      credential = cert(key)
    } catch (e) {
      console.warn('firebase-admin: FIREBASE_SERVICE_ACCOUNT_JSON parse failed', e?.message)
    }
  }
  if (!credential && cred) {
    // Use default credential (e.g. GOOGLE_APPLICATION_CREDENTIALS path or ADC)
    credential = undefined
  }
  const options = credential ? { credential } : {}
  if (projectId) options.projectId = projectId
  return initializeApp(options)
}

function toMillis(value) {
  if (!value) return 0
  if (typeof value?.toMillis === 'function') return value.toMillis()
  if (value && typeof value.toDate === 'function') return value.toDate().getTime()
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  if (value && typeof value._seconds === 'number') return value._seconds * 1000 + ((value._nanoseconds || 0) / 1e6)
  return 0
}

/** Recursively serialize Firestore Timestamps to ISO strings for JSON-safe props */
function serializeForClient(obj) {
  if (obj == null) return obj
  if (typeof obj.toDate === 'function') {
    return obj.toDate().toISOString()
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeForClient)
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = serializeForClient(v)
    }
    return out
  }
  return obj
}

/** Filter properties by criteria (mirror of client filterPropertiesByCriteria) */
function filterPropertiesByCriteria(properties, criteria) {
  if (!criteria || Object.keys(criteria).length === 0) {
    return properties.filter((p) => p.status === 'available')
  }
  const toStr = (v) => (v != null && typeof v === 'string' ? v : String(v ?? '')).trim()
  let list = properties.filter((p) => p.status === 'available')
  const { maxPrice, minPrice, location, type, tags } = criteria
  if (minPrice != null && Number(minPrice) > 0) {
    const v = Number(minPrice)
    list = list.filter((p) => (Number(p?.price) || 0) >= v)
  }
  if (maxPrice != null && Number(maxPrice) > 0) {
    const v = Number(maxPrice)
    list = list.filter((p) => (Number(p?.price) || 0) <= v)
  }
  if (location && toStr(location).length > 0) {
    const loc = toStr(location).toLowerCase()
    list = list.filter((p) => {
      const prov = toStr(p?.location?.province).toLowerCase()
      const dist = toStr(p?.location?.district).toLowerCase()
      return prov.includes(loc) || dist.includes(loc)
    })
  }
  if (type && toStr(type).length > 0) {
    list = list.filter((p) => p?.type === type)
  }
  if (tags && Array.isArray(tags) && tags.length > 0) {
    list = list.filter((p) => {
      const pt = p?.customTags || p?.tags || []
      return tags.some((t) => pt.includes(t))
    })
  }
  return list
}

/**
 * Home page data for SSR. Returns { properties, popularLocations, homepageSections, featuredBlogs }
 * All Timestamp fields are serialized to ISO strings for client-safe JSON.
 */
export async function getHomePageData() {
  const app = getAdminApp()
  const db = getFirestore(app)

  const [propertiesSnap, locationsSnap, sectionsSnap, blogsSnap] = await Promise.all([
    db.collection(PROPERTIES).get(),
    db.collection(POPULAR_LOCATIONS).get(),
    db.collection(HOMEPAGE_SECTIONS).get(),
    db
      .collection(BLOGS)
      .where('published', '==', true)
      .where('isFeatured', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get(),
  ])

  let properties = propertiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  properties.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))

  let popularLocations = locationsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  popularLocations.sort((a, b) => {
    const orderA = a.order ?? 999
    const orderB = b.order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return toMillis(b.createdAt) - toMillis(a.createdAt)
  })
  popularLocations = popularLocations.filter((loc) => loc.isActive === true)

  let homepageSections = sectionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  homepageSections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  homepageSections = homepageSections.filter((s) => s.isActive === true)

  const featuredBlogs = blogsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

  return {
    properties: serializeForClient(properties),
    popularLocations: serializeForClient(popularLocations),
    homepageSections: serializeForClient(homepageSections),
    featuredBlogs: serializeForClient(featuredBlogs),
  }
}

/**
 * Single property by ID for PropertyDetail SSR / generateMetadata.
 */
export async function getPropertyById(id) {
  if (!id) return null
  const app = getAdminApp()
  const db = getFirestore(app)
  const doc = await db.collection(PROPERTIES).doc(id).get()
  if (!doc.exists) return null
  return serializeForClient({ id: doc.id, ...doc.data() })
}

/**
 * Share link by token (for Share page metadata / SSR).
 */
export async function getShareLinkByToken(token) {
  if (!token) return null
  const app = getAdminApp()
  const db = getFirestore(app)
  const doc = await db.collection(SHARE_LINKS).doc(token).get()
  if (!doc.exists) return null
  return serializeForClient({ id: doc.id, ...doc.data() })
}

/**
 * Properties list for SSR (e.g. first page of listing). Optional filters.
 */
export async function getPropertiesList(options = {}) {
  const { availableOnly = false, limitCount = 50 } = options
  const app = getAdminApp()
  const db = getFirestore(app)
  let ref = db.collection(PROPERTIES).orderBy('createdAt', 'desc').limit(limitCount)
  const snap = await ref.get()
  let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (availableOnly) list = list.filter((p) => p.status === 'available')
  return serializeForClient(list)
}

/**
 * Blog by ID for BlogDetail generateMetadata.
 */
export async function getBlogById(id) {
  if (!id) return null
  const app = getAdminApp()
  const db = getFirestore(app)
  const doc = await db.collection(BLOGS).doc(id).get()
  if (!doc.exists) return null
  return serializeForClient({ id: doc.id, ...doc.data() })
}
