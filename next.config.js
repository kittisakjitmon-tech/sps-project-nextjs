/** @type {import('next').NextConfig} */
const path = require('path')
const fs = require('fs')

/** Load NEXT_PUBLIC_* from .env so client bundle gets them even if process.env isn't set when config runs */
function loadEnvKeys(keys) {
  const envPath = path.join(__dirname, '.env')
  const out = {}
  if (!fs.existsSync(envPath)) return out
  const content = fs.readFileSync(envPath, 'utf8')
  keys.forEach((key) => {
    const re = new RegExp('^' + key + '=(.*)$', 'm')
    const m = content.match(re)
    if (m && m[1]) out[key] = m[1].trim()
  })
  return out
}

const publicEnv = loadEnvKeys([
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
])

const nextConfig = {
  reactStrictMode: true,
  // Static export for Firebase Hosting (switch off when using SSR with Firebase Admin)
  // output: 'export',
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: publicEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: publicEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: [],
}

module.exports = nextConfig
