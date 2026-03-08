import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)

setPersistence(auth, browserLocalPersistence)

const provider = new GoogleAuthProvider()

// ── AUTH ─────────────────────────────────────────────────

export async function signInWithGoogle() {
  await signInWithRedirect(auth, provider)
}

export async function getGoogleRedirectResult() {
  const result = await getRedirectResult(auth)
  if (!result) return null
  const user = result.user
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: serverTimestamp(),
      state: null,
    })
  }
  return user
}

export async function logOut() {
  return signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// ── FIRESTORE DATA ────────────────────────────────────────

export async function loadUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const data = snap.data()
  return data.state ? JSON.parse(data.state) : null
}

export async function saveUserData(uid, stateObj) {
  await setDoc(
    doc(db, 'users', uid),
    { state: JSON.stringify(stateObj), updatedAt: serverTimestamp() },
    { merge: true }
  )
}