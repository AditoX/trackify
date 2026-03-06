'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { logIn } from '../../lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await logIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      const msg = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Wrong password. Try again.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }
      setError(msg[err.code] || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  const inp = { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'DM Sans, sans-serif' }
  const lbl = { fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:6 }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <Link href="/" style={{ fontFamily:'Bebas Neue', fontSize:28, letterSpacing:2, color:'var(--accent)', textDecoration:'none' }}>TRACKIFY</Link>
          <div style={{ fontSize:22, fontWeight:600, marginTop:14 }}>Welcome back 👋</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginTop:4 }}>Sign in to continue your streak 🔥</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:32 }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@email.com" style={inp} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={inp} />
            </div>
            {error && (
              <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#f87171', marginBottom:16 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:8, padding:12, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.6:1, fontFamily:'DM Sans, sans-serif' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>Sign up free</Link>
        </div>
      </div>
    </div>
  )
}
