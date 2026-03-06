/**
 * Next.js navigation helpers — use these instead of react-router-dom
 * so the same components work in Next.js App Router.
 */
export { default as Link } from 'next/link'
export { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'

/** Normalize searchParams so .get(key) and .toString() always work (handles plain object or URLSearchParams) */
export function toSafeSearchParams(raw) {
  if (raw != null && typeof raw.get === 'function') return raw
  const obj = raw != null && typeof raw === 'object' ? raw : {}
  return {
    get: (key) => (obj[key] != null ? String(obj[key]) : ''),
    toString: () => new URLSearchParams(obj).toString(),
  }
}
