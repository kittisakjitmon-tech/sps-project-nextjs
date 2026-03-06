import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

function createApp(name) {
  const existing = getApps().find(app => app.name === name)
  if (existing) return existing
  return initializeApp(firebaseConfig, name)
}

const isBrowser = typeof window !== "undefined"

let publicApp = null
let adminApp = null

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  publicApp = createApp("publicApp")
  adminApp = createApp("adminApp")
}

export const publicAuth = publicApp ? getAuth(publicApp) : null
export const publicDb = publicApp ? getFirestore(publicApp) : null
export const publicStorage = publicApp ? getStorage(publicApp) : null

export const adminAuth = adminApp ? getAuth(adminApp) : null
export const adminDb = adminApp ? getFirestore(adminApp) : null
export const adminStorage = adminApp ? getStorage(adminApp) : null

function isAdminPath() {
  if (!isBrowser) return false
  return window.location.pathname.startsWith("/sps-internal-admin")
}

export const db = isBrowser && isAdminPath() ? adminDb : publicDb
export const storage = isBrowser && isAdminPath() ? adminStorage : publicStorage
export const auth = publicAuth

export default publicApp