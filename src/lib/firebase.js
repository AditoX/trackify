import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
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

// Prevent duplicate app init in Next.js hot reload
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)

// Keep user logged in across browser sessions
setPersistence(auth, browserLocalPersistence)

// ── AUTH ─────────────────────────────────────────────────

export async function signUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  // Create user doc in Firestore
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
    state: null,
  })
  return cred.user
}

export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
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