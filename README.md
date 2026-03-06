# 🚀 Trackify — Build Yourself

> Free self-improvement app · Made in India 🇮🇳 · Built with AI · Zero code written by hand

**Stack:** Next.js 14 · Firebase (Auth + Firestore) · Vercel

---

## ⚡ Setup in 4 Steps

### Step 1 — Install Node.js
Download from https://nodejs.org (pick the LTS version)

---

### Step 2 — Set up Firebase (free, 5 mins)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `trackify` → create
3. **Enable Authentication:**
   - Left sidebar → **Build → Authentication → Get started**
   - Click **Email/Password** → Enable → Save
4. **Enable Firestore:**
   - Left sidebar → **Build → Firestore Database → Create database**
   - Choose **"Start in production mode"** → pick region **`asia-south1` (Mumbai)** → Enable
   - Go to **Rules** tab → paste this and click Publish:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```
5. **Get your config:**
   - Click the gear icon ⚙️ → **Project settings**
   - Scroll to **"Your apps"** → click **</>** (Web)
   - Register app name → copy the `firebaseConfig` object

---

### Step 3 — Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in values from your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=trackify-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=trackify-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=trackify-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

---

### Step 4 — Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — sign up and test it!

---

## 🌐 Deploy to Vercel (free)

1. Push your project to GitHub (make sure `.env.local` is in `.gitignore` ✅)
2. Go to https://vercel.com → **Add New Project** → import your repo
3. In **Environment Variables**, add all 6 `NEXT_PUBLIC_FIREBASE_*` values
4. Click **Deploy** — your app is live! 🎉

> **Tip:** Add your Vercel domain to Firebase:
> Firebase Console → Authentication → Settings → Authorized domains → Add your `.vercel.app` URL

---

## 📁 Project Structure

```
src/
  app/
    page.js              ← Landing page
    layout.js            ← SEO + root layout
    login/page.js        ← Login
    signup/page.js       ← Signup
    dashboard/page.js    ← The full app
    globals.css          ← CSS variables & fonts
  lib/
    firebase.js          ← Firebase client + auth + Firestore helpers
```

---

## 💰 Costs

| Service   | Cost         |
|-----------|-------------|
| Firebase  | Free (Spark plan) — 50k reads/day, 20k writes/day, unlimited auth |
| Vercel    | Free forever for hobby projects |
| Domain    | Optional ~₹500/yr on GoDaddy |
| **Total** | **₹0** until you're big |

---

## ☕ Support

If this helped you → https://buymeacoffee.com

Made with ❤️ in India
