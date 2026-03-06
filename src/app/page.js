'use client'
import Link from 'next/link'

const features = [
  { icon: '🎯', title: 'Daily Challenges', desc: 'Morning, afternoon & evening challenges to build discipline every single day.' },
  { icon: '🔥', title: 'Habit Tracker', desc: 'Track streaks, build consistency, and watch your habits compound over time.' },
  { icon: '💪', title: 'Workout Logger', desc: 'Log every set and rep. Track your progress and see your strength grow.' },
  { icon: '📋', title: 'Custom Routines', desc: 'Build routines tailored to your lifestyle — gym day, rest day, work day.' },
  { icon: '⚡', title: 'XP & Levels', desc: 'Gamified progression system that rewards you for showing up every day.' },
  { icon: '☁️', title: 'Syncs Everywhere', desc: 'Your data saved to the cloud. Access from any device, anywhere.' },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 2, color: 'var(--accent)' }}>TRACKIFY</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>Login</Link>
            <Link href="/signup" style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.12)', color: 'var(--accent)', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 28 }}>
          🇮🇳 Made in India · Built with AI · 100% Free
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1, letterSpacing: 3, marginBottom: 24 }}>
          BUILD THE BEST<br /><span style={{ color: 'var(--accent)' }}>VERSION OF YOURSELF</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Trackify helps you build habits, crush daily challenges, and track your fitness — all in one free app built for India.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start for Free →
          </Link>
          <Link href="/login" style={{ background: 'var(--surface)', color: 'var(--text)', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--border)' }}>
            I have an account
          </Link>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>No credit card · No downloads · Works in your browser</p>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 42, letterSpacing: 2, marginBottom: 10 }}>
              EVERYTHING YOU NEED TO <span style={{ color: 'var(--accent)' }}>LEVEL UP</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>No fluff. Just the tools that actually build discipline.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 42, letterSpacing: 2 }}>HOW IT <span style={{ color: 'var(--accent)' }}>WORKS</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { n: '01', title: 'Create free account', desc: 'Sign up in seconds with just your email. No credit card ever.' },
            { n: '02', title: 'Set your routine', desc: 'Pick your habits and build your daily challenge plan.' },
            { n: '03', title: 'Show up daily', desc: 'Check off tasks, earn XP, level up your real life.' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 56, color: 'var(--accent)', lineHeight: 1, marginBottom: 12, opacity: 0.35 }}>{s.n}</div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MADE IN INDIA */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🇮🇳</div>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: 2, marginBottom: 12 }}>
            PROUDLY <span style={{ color: 'var(--accent)' }}>MADE IN INDIA</span>
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            Built by an Indian teenager using AI — without writing a single line of code by hand.
            Proof that great software can come from anywhere, by anyone.
          </p>
          <a href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer"
            style={{ background: '#FFDD00', color: '#000', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            ☕ Buy me a coffee
          </a>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 52, letterSpacing: 2, marginBottom: 14 }}>
          READY TO <span style={{ color: 'var(--accent)' }}>START?</span>
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>Free forever. No excuses.</p>
        <Link href="/signup" style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '16px 44px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
          Create Free Account →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>
          © 2025 Trackify · Made with ❤️ in India ·{' '}
          <a href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Support the project ☕</a>
        </div>
      </footer>
    </div>
  )
}
