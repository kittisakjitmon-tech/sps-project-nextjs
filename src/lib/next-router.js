/**
 * Next.js navigation helpers — use these instead of react-router-dom
 * so the same components work in Next.js App Router.
 */
export { default as Link } from 'next/link'
export { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'

/** Normalize searchParams so .get(key) and .toString() always work (handles plain object or URLSearchParams). Never throws. */
export function toSafeSearchParams(raw) {
  if (raw == null) {
    return { get: () => '', toString: () => '' }
  }
  try {
    if (typeof raw.get === 'function' && typeof raw.toString === 'function') {
      const str = raw.toString()
      if (typeof str === 'string') {
        return {
          get: (key) => {
            try {
              const v = raw.get(key)
              return v != null ? String(v) : ''
            } catch {
              return ''
            }
          },
          toString: () => str,
        }
      }
    }
  } catch (_) {
    // fall through to build safe object
  }
  const obj = typeof raw === 'object' ? raw : {}
  const record = {}
  try {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof k === 'string' && v != null && v !== '' && typeof v !== 'object') {
        record[k] = String(v)
      }
    }
  } catch (_) {
    // ignore
  }
  return {
    get: (key) => (record[key] != null ? record[key] : ''),
    toString: () => {
      try {
        return new URLSearchParams(record).toString()
      } catch {
        return ''
      }
    },
  }
}
