/**
 * Cloudinary CDN helpers — สร้าง URL สำหรับแสดงรูปด้วย resize/format ฝั่ง CDN
 * ใช้กับรูปที่อัปโหลดผ่าน Cloudinary (res.cloudinary.com)
 */

const CLOUD_NAME = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) || ''
const CDN_BASE = CLOUD_NAME ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload` : ''

/**
 * ตรวจว่าเป็น URL ของ Cloudinary หรือไม่
 */
export function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false
  return url.includes('res.cloudinary.com') && url.includes('/image/upload')
}

/**
 * แยก path เป็น cloudName (ถ้ามี), transforms, publicId และ base
 * โครงสร้าง: https://res.cloudinary.com/{cloudName}/image/upload/{transforms}/{publicId}
 * หรือ (เก่า): https://res.cloudinary.com/image/upload/{publicId} → ใช้ CDN_BASE จาก env
 */
function parseCloudinaryPath(fullUrl) {
  if (!isCloudinaryUrl(fullUrl)) return null
  try {
    const u = new URL(fullUrl)
    const pathname = u.pathname

    // รูปแบบมี cloud name: /{cloudName}/image/upload/...
    const withCloud = pathname.match(/^\/([^/]+)\/image\/upload\/(.+)$/)
    if (withCloud) {
      const cloudName = withCloud[1]
      const afterUpload = withCloud[2]
      const base = `${u.origin}/${cloudName}/image/upload`
      const parts = afterUpload.split('/')
      if (parts.length >= 2) {
        const publicId = parts.slice(1).join('/')
        return { transform: parts[0], publicId, base }
      }
      return { transform: '', publicId: afterUpload, base }
    }

    // รูปแบบไม่มี cloud name: /image/upload/... → ใช้ CDN_BASE
    const noCloud = pathname.match(/^\/image\/upload\/(.+)$/)
    if (noCloud && CDN_BASE) {
      const afterUpload = noCloud[1]
      const parts = afterUpload.split('/')
      const publicId = parts.length >= 2 ? parts.slice(1).join('/') : afterUpload
      const transform = parts.length >= 2 ? parts[0] : ''
      return { transform, publicId, base: CDN_BASE }
    }
    if (noCloud) return null
    return null
  } catch {
    return null
  }
}

/**
 * สร้าง Cloudinary URL สำหรับแสดงรูป พร้อม resize/format ผ่าน CDN
 * @param {string} url - URL เต็มจาก Cloudinary (หรือ URL อื่น จะได้คืนตามเดิม)
 * @param {object} options - { width, height, crop, quality, format }
 *   - width, height: จำนวนพิกเซล (ถ้าไม่ใส่ใช้ของเดิม)
 *   - crop: 'fill' | 'fit' | 'scale' | 'thumb' (default 'fill' เมื่อมี width/height)
 *   - quality: 'auto' หรือตัวเลข
 *   - format: 'auto' ให้ CDN เลือก (webp/avif ตาม browser)
 */
export function getCloudinaryImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url

  // ถ้าเป็นแค่ public_id (ไม่มี res.cloudinary.com) และมี CDN_BASE → สร้าง URL เอง
  if (!isCloudinaryUrl(url) && CDN_BASE) {
    const publicId = url.trim()
    if (publicId && !publicId.includes('://') && !publicId.startsWith('/')) {
      const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options
      const transforms = []
      if (width) transforms.push(`w_${width}`)
      if (height) transforms.push(`h_${height}`)
      if ((width || height) && crop) transforms.push(`c_${crop}`)
      transforms.push(`q_${quality}`)
      transforms.push(`f_${format}`)
      const transformStr = transforms.join(',')
      return `${CDN_BASE}/${transformStr}/${publicId}`
    }
  }

  if (!isCloudinaryUrl(url)) return url

  const parsed = parseCloudinaryPath(url)
  if (!parsed) return url

  const base = CDN_BASE || parsed.base
  if (!base) return url

  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options
  const transforms = []
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if ((width || height) && crop) transforms.push(`c_${crop}`)
  transforms.push(`q_${quality}`)
  transforms.push(`f_${format}`)

  const transformStr = transforms.join(',')
  const newPath = transformStr ? `${transformStr}/${parsed.publicId}` : `${parsed.transform}/${parsed.publicId}`

  return `${base}/${newPath}`
}

/**
 * URL รูป thumbnail สำหรับ card/list (ความกว้าง 400)
 */
export function getCloudinaryThumbUrl(url) {
  return getCloudinaryImageUrl(url, { width: 400, crop: 'fill' })
}

/**
 * URL รูปขนาดกลาง สำหรับ slider/detail (ความกว้าง 800)
 */
export function getCloudinaryMediumUrl(url) {
  return getCloudinaryImageUrl(url, { width: 800, crop: 'fill' })
}

/**
 * URL รูปขนาดใหญ่ สำหรับหน้า detail gallery (ความกว้าง 1200)
 */
export function getCloudinaryLargeUrl(url) {
  return getCloudinaryImageUrl(url, { width: 1200, crop: 'fill' })
}

/**
 * Loader for next/image — builds Cloudinary URL with width/quality for srcset.
 * Next.js requires the returned URL to include width; we always add w_ so the loader "implements" width.
 * Usage: <Image src={cloudinaryUrl} loader={cloudinaryLoader} width={400} height={300} sizes="..." />
 */
export function cloudinaryLoader({ src, width, quality }) {
  const w = Number(width)
  return getCloudinaryImageUrl(src, {
    width: Number.isFinite(w) && w > 0 ? w : 1024,
    quality: quality ?? 'auto',
    crop: 'fill',
  })
}
