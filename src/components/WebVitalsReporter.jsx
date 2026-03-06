'use client'

import { useEffect } from 'react'

/**
 * Reports Core Web Vitals (LCP, INP, CLS) for monitoring and tuning.
 * Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
 * Wire to your analytics (e.g. gtag, sendBeacon) in onReport as needed.
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')
        const onReport = (metric) => {
          if (!mounted) return
          if (process.env.NODE_ENV === 'development') {
            console.log('[Web Vitals]', metric.name, metric.value, metric.rating, metric.id)
          }
          // Optional: send to analytics
          // if (typeof window !== 'undefined' && window.gtag) {
          //   window.gtag('event', metric.name, { value: Math.round(metric.value), event_label: metric.id })
          // }
        }
        onCLS(onReport)
        onINP(onReport)
        onLCP(onReport)
        onFCP(onReport)
        onTTFB(onReport)
      } catch (e) {
        // web-vitals not available or load failed
      }
    }
    init()
    return () => { mounted = false }
  }, [])
  return null
}
