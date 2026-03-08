'use client'
import Link from 'next/link'
import { useEffect } from 'react'

const SLATE = {
  bg: '#0f1117', surface: '#181c27', surface2: '#1f2435',
  border: '#2a3045', accent: '#93c5fd', accentRgb: '147,197,253',
  text: '#dce8ff', muted: '#4d607a'
}

const features = [
  { icon: '🎯', title: 'Daily Challenges', desc: 'Morning, afternoon & evening challenges to build discipline every single day.' },
  { icon: '🔥', title: 'Habit Tracker', desc: 'Track streaks, build consistency, and watch your habits compound over time.' },
  { icon: '💪', title: 'Workout Logger', desc: 'Log every set and rep. Track your progress and see your strength grow.' },
  { icon: '📋', title: 'Custom Routines', desc: 'Build routines tailored to your lifestyle — gym day, rest day, work day.' },
  { icon: '⚡', title: 'XP & Levels', desc: 'Gamified progression system that rewards you for showing up every day.' },
  { icon: '☁️', title: 'Syncs Everywhere', desc: 'Your data saved to the cloud. Access from any device, anywhere.' },
]

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'translateY(0)'
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

export default function Home() {
  useScrollReveal()
  const c = SLATE

  return (
    <div style={{ background: c.bg, minHeight: '100vh', color: c.text }}>
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes glow     { 0%,100% { box-shadow:0 0 20px rgba(${c.accentRgb},0.2); } 50% { box-shadow:0 0 40px rgba(${c.accentRgb},0.5); } }

        .nav-animate { animation: fadeDown 0.5s ease both; }
        .hero-badge  { animation: fadeUp 0.5s ease 0.1s both; }
        .hero-h1     { animation: fadeUp 0.6s ease 0.2s both; }
        .hero-p      { animation: fadeUp 0.6s ease 0.35s both; }
        .hero-btns   { animation: fadeUp 0.6s ease 0.5s both; }
        .hero-sub    { animation: fadeUp 0.6s ease 0.65s both; }

        .shimmer-text {
          background: linear-gradient(90deg, ${c.accent}, #e0f2fe, ${c.accent});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .cta-btn {
          background: ${c.accent}; color: ${c.bg};
          padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 700;
          text-decoration: none; display: inline-block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px rgba(${c.accentRgb},0.35);
        }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(${c.accentRgb},0.5); }
        .ghost-btn {
          background: ${c.surface}; color: ${c.text};
          padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;
          text-decoration: none; display: inline-block; border: 1px solid ${c.border};
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ghost-btn:hover { transform: translateY(-3px); border-color: rgba(${c.accentRgb},0.4); }
        .feature-card {
          background: ${c.surface2}; border: 1px solid ${c.border}; border-radius: 14px; padding: 28px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(${c.accentRgb},0.2);
          border-color: rgba(${c.accentRgb},0.3);
        }
        .feature-icon { display:inline-block; animation: float 4s ease-in-out infinite; }
        .step-card {
          text-align:center; padding:32px 24px; border-radius:14px;
          border:1px solid ${c.border}; background:${c.surface};
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .step-card:hover { transform:translateY(-4px); border-color:rgba(${c.accentRgb},0.3); }
        .nav-link { color:${c.muted}; font-size:15px; text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:${c.text}; }
        .india-card {
          background:${c.surface}; border:1px solid ${c.border}; border-radius:16px;
          padding:52px 36px; max-width:580px; margin:0 auto;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .india-card:hover { border-color:rgba(${c.accentRgb},0.3); box-shadow:0 8px 40px rgba(0,0,0,0.3); }
      `}</style>

      {/* NAV */}
      <nav className="nav-animate" style={{ borderBottom:`1px solid ${c.border}`, background:`${c.surface}dd`, backdropFilter:'blur(14px)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'Bebas Neue', fontSize:24, letterSpacing:2, color:c.accent }}>TRACKIFY</div>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            
            <Link href="/login" className="cta-btn" style={{ padding:'8px 22px', fontSize:14 }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'120px 24px 100px', textAlign:'center' }}>
        <div className="hero-badge" style={{ display:'inline-block', background:`rgba(${c.accentRgb},0.1)`, color:c.accent, fontSize:11, fontWeight:600, padding:'5px 16px', borderRadius:20, letterSpacing:1.5, textTransform:'uppercase', marginBottom:32, border:`1px solid rgba(${c.accentRgb},0.2)` }}>
          🇮🇳 Made in India · Built with AI · 100% Free
        </div>
        <h1 className="hero-h1" style={{ fontFamily:'Bebas Neue', fontSize:'clamp(52px, 8vw, 100px)', lineHeight:1, letterSpacing:3, marginBottom:28, color:c.text }}>
          BUILD THE BEST<br />
          <span className="shimmer-text">VERSION OF YOURSELF</span>
        </h1>
        <p className="hero-p" style={{ fontSize:19, color:c.muted, maxWidth:520, margin:'0 auto 44px', lineHeight:1.8 }}>
          Trackify helps you build habits, crush daily challenges, and track your fitness — all in one free app built for India.
        </p>
        <div className="hero-btns" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" className="cta-btn">Start for Free →</Link>
          
        </div>
        <p className="hero-sub" style={{ fontSize:13, color:c.muted, marginTop:18 }}>No credit card · No downloads · Works in your browser</p>
      </section>

      {/* FEATURES */}
      <section style={{ background:c.surface, borderTop:`1px solid ${c.border}`, borderBottom:`1px solid ${c.border}`, padding:'90px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <h2 style={{ fontFamily:'Bebas Neue', fontSize:46, letterSpacing:2, marginBottom:12, color:c.text }}>
              EVERYTHING YOU NEED TO <span style={{ color:c.accent }}>LEVEL UP</span>
            </h2>
            <p style={{ color:c.muted, fontSize:16 }}>No fluff. Just the tools that actually build discipline.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:20 }}>
            {features.map((f, i) => (
              <div key={f.title} className="feature-card reveal" style={{ transitionDelay:`${i*0.08}s` }}>
                <div className="feature-icon" style={{ fontSize:32, marginBottom:14, animationDelay:`${i*0.3}s` }}>{f.icon}</div>
                <div style={{ fontWeight:700, fontSize:17, marginBottom:8, color:c.text }}>{f.title}</div>
                <div style={{ color:c.muted, fontSize:14, lineHeight:1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'90px 24px' }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:46, letterSpacing:2, color:c.text }}>
            HOW IT <span style={{ color:c.accent }}>WORKS</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:24 }}>
          {[
            { n:'01', title:'Create free account', desc:'Sign up in seconds with just your email. No credit card ever.' },
            { n:'02', title:'Set your routine',    desc:'Pick your habits and build your daily challenge plan.' },
            { n:'03', title:'Show up daily',        desc:'Check off tasks, earn XP, level up your real life.' },
          ].map((s, i) => (
            <div key={s.n} className="step-card reveal" style={{ transitionDelay:`${i*0.1}s` }}>
              <div style={{ fontFamily:'Bebas Neue', fontSize:64, color:c.accent, lineHeight:1, marginBottom:14, opacity:0.3 }}>{s.n}</div>
              <div style={{ fontWeight:700, fontSize:18, marginBottom:10, color:c.text }}>{s.title}</div>
              <div style={{ color:c.muted, fontSize:15, lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MADE IN INDIA */}
      <section style={{ background:c.surface, borderTop:`1px solid ${c.border}`, borderBottom:`1px solid ${c.border}`, padding:'70px 24px', textAlign:'center' }}>
        <div className="india-card reveal">
          <div style={{ fontSize:48, marginBottom:16 }}>🇮🇳</div>
          <h3 style={{ fontFamily:'Bebas Neue', fontSize:36, letterSpacing:2, marginBottom:14, color:c.text }}>
            PROUDLY <span style={{ color:c.accent }}>MADE IN INDIA</span>
          </h3>
          <p style={{ color:c.muted, fontSize:16, lineHeight:1.8 }}>
            Built by an Indian teenager using AI — without writing a single line of code by hand.
            Proof that great software can come from anywhere, by anyone.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'90px 24px', textAlign:'center' }}>
        <div className="reveal">
          <h2 style={{ fontFamily:'Bebas Neue', fontSize:56, letterSpacing:2, marginBottom:16, color:c.text }}>
            READY TO <span style={{ color:c.accent }}>START?</span>
          </h2>
          <p style={{ color:c.muted, fontSize:17, marginBottom:36 }}>Free forever. No excuses.</p>
          <Link href="/login" className="cta-btn" style={{ fontSize:17, padding:'18px 48px' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${c.border}`, padding:'32px 24px', textAlign:'center' }}>
        <div style={{ color:c.muted, fontSize:13 }}>© 2025 Trackify · Made with ❤️ in India</div>
      </footer>
    </div>
  )
}