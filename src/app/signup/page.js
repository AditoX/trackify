'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '../../lib/firebase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(''); setLoading(true)
    try {
      await signUp(name, email, password)
      router.push('/dashboard')
    } catch (err) {
      const msg = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      }
      setError(msg[err.code] || 'Signup failed. Please try again.')
    } finally { setLoading(false) }
  }

  const inp = { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', padding:'10px 14px', fontSize:14, outline:'none', fontFamily:'DM Sans, sans-serif' }
  const lbl = { fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:6 }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <Link href="/" style={{ fontFamily:'Bebas Neue', fontSize:28, letterSpacing:2, color:'var(--accent)', textDecoration:'none' }}>TRACKIFY</Link>
          <div style={{ fontSize:22, fontWeight:600, marginTop:14 }}>Create your account 🚀</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginTop:4 }}>Free forever. Start your streak today.</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:32 }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Your Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Arjun" style={inp} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@email.com" style={inp} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min 8 characters" style={inp} />
            </div>
            {error && (
              <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#f87171', marginBottom:16 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:8, padding:12, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.6:1, fontFamily:'DM Sans, sans-serif' }}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>
          <p style={{ fontSize:11, color:'var(--muted)', textAlign:'center', marginTop:16, lineHeight:1.6 }}>
            By signing up you agree to use this app responsibly 🙏
          </p>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
