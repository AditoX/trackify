'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithGoogle, getGoogleRedirectResult } from '../../lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getGoogleRedirectResult()
      .then(user => {
        if (user) router.push('/dashboard')
        else setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Sign in failed. Please try again.')
        setLoading(false)
      })
  }, [])

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue', fontSize:28, color:'var(--accent)', letterSpacing:2, marginBottom:10 }}>TRACKIFY</div>
        <div style={{ color:'var(--muted)', fontSize:13 }}>Signing you in...</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400 }}>

        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link href="/" style={{ fontFamily:'Bebas Neue', fontSize:28, letterSpacing:2, color:'var(--accent)', textDecoration:'none' }}>TRACKIFY</Link>
          <div style={{ fontSize:22, fontWeight:600, marginTop:16, color:'var(--text)' }}>Welcome 👋</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginTop:6 }}>Sign in to start your streak 🔥</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:36, textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚡</div>
          <div style={{ fontWeight:600, fontSize:16, marginBottom:8, color:'var(--text)' }}>One tap to get started</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginBottom:28, lineHeight:1.6 }}>
            No password needed. Sign in with your Google account — it's instant and secure.
          </div>

          <button onClick={handleGoogle}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12, background:'#fff', color:'#1f1f1f', border:'none', borderRadius:10, padding:'13px 20px', fontSize:15, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {error && (
            <div style={{ marginTop:16, background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#f87171' }}>
              {error}
            </div>
          )}

          <div style={{ marginTop:20, fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>
            🔒 We only access your name and email.<br />No posting, no contacts, no data selling.
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--muted)' }}>
          <Link href="/" style={{ color:'var(--accent)', textDecoration:'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}