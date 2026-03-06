'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthChange, logOut, loadUserData, saveUserData } from '../../lib/firebase'

// ─── DEFAULT STATE ────────────────────────────────────────
const DEFAULT_STATE = () => ({
  xp: 0,
  streak: 0,
  lastSaved: '',
  settings: { toasts: true, theme: 'slate' },
  challenges: [
    { id:1, name:'10-Min Cold Shower',  icon:'🚿', time:'Morning',   slot:'morning',   done:false, xp:50, why:'Boosts dopamine & mental toughness' },
    { id:2, name:'30-Min Walk Outside', icon:'🚶', time:'Afternoon', slot:'afternoon', done:false, xp:40, why:'Clears mind, improves mood' },
    { id:3, name:'Evening Journaling',  icon:'📓', time:'Evening',   slot:'evening',   done:false, xp:30, why:'Builds self-awareness' },
    { id:4, name:'5-Min Meditation',    icon:'🧘', time:'Morning',   slot:'morning',   done:false, xp:35, why:'Reduces cortisol, sharpens focus' },
    { id:5, name:'100 Push-Ups',        icon:'💪', time:'Afternoon', slot:'afternoon', done:false, xp:60, why:'Builds strength & discipline' },
    { id:6, name:'Read 20 Pages',       icon:'📚', time:'Evening',   slot:'evening',   done:false, xp:30, why:'Expands knowledge daily' },
  ],
  habits: [
    { id:1, emoji:'💧', name:'Drink 3L Water',    streak:0, done:false },
    { id:2, emoji:'🛌', name:'Sleep 8hrs',         streak:0, done:false },
    { id:3, emoji:'🥗', name:'Eat Clean',          streak:0, done:false },
    { id:4, emoji:'📵', name:'No Phone 1hr',       streak:0, done:false },
    { id:5, emoji:'🌅', name:'Wake Before 7am',    streak:0, done:false },
    { id:6, emoji:'🧴', name:'Skincare Routine',   streak:0, done:false },
    { id:7, emoji:'🎯', name:'Daily Goal Set',     streak:0, done:false },
    { id:8, emoji:'🙏', name:'Gratitude Practice', streak:0, done:false },
  ],
  workouts: [],
  taskDoneMap: {},
  routines: [
    { id:1, name:'Default Routine', desc:'Your daily plan', tasks:{
      morning:   [{id:101,name:'Wake Up at 6am',icon:'⏰',desc:'Discipline starts here',xp:20},{id:102,name:'Cold Shower',icon:'🚿',desc:'Boost energy',xp:40},{id:103,name:'Meditation',icon:'🧘',desc:'10 min mindfulness',xp:30}],
      afternoon: [{id:104,name:'Workout Session',icon:'💪',desc:'Push your limits',xp:60},{id:105,name:'30-Min Walk',icon:'🚶',desc:'Low-intensity cardio',xp:30}],
      evening:   [{id:106,name:'Read 20 Pages',icon:'📚',desc:'Grow 1% daily',xp:25},{id:107,name:'Journal',icon:'📓',desc:'Reflect on the day',xp:20},{id:108,name:'Plan Tomorrow',icon:'📋',desc:'Set up your next win',xp:15}]
    }},
    { id:2, name:'Rest Day', desc:'Recovery & recharge', tasks:{
      morning:   [{id:201,name:'Slow Morning',icon:'☕',desc:'Let your body recover',xp:10},{id:202,name:'Stretching',icon:'🤸',desc:'15-min full body stretch',xp:20}],
      afternoon: [{id:203,name:'Nature Walk',icon:'🌿',desc:'Unplug in nature',xp:25}],
      evening:   [{id:204,name:'Leisure Time',icon:'🎬',desc:'Intentional rest',xp:10},{id:205,name:'Early Sleep',icon:'😴',desc:'8+ hours priority',xp:20}]
    }}
  ]
})

const THEMES = {
  default: { accent:'#a78bfa', accentRgb:'167,139,250', bg:'#121318', surface:'#1c1e26', surface2:'#252830', border:'#2e3140', text:'#e8eaf0', muted:'#6b7280' },
  neon:    { accent:'#e8ff4a', accentRgb:'232,255,74',  bg:'#0a0a0a', surface:'#111111', surface2:'#1a1a1a', border:'#222222', text:'#f0f0f0', muted:'#555555' },
  ocean:   { accent:'#38bdf8', accentRgb:'56,189,248',  bg:'#0d1b2a', surface:'#132235', surface2:'#1a2d44', border:'#1e3a52', text:'#e2f0fb', muted:'#4e7494' },
  rose:    { accent:'#fb7185', accentRgb:'251,113,133', bg:'#1a0f14', surface:'#241520', surface2:'#2e1c2a', border:'#3d2535', text:'#fce7f3', muted:'#7d4f62' },
  forest:  { accent:'#86efac', accentRgb:'134,239,172', bg:'#0e1610', surface:'#141f16', surface2:'#1c2b1e', border:'#253328', text:'#ecfdf5', muted:'#4a6b52' },
  slate:   { accent:'#93c5fd', accentRgb:'147,197,253', bg:'#0f1117', surface:'#181c27', surface2:'#1f2435', border:'#2a3045', text:'#dce8ff', muted:'#4d607a' },
}

const LEVEL_TAGS = ['','Rookie','Challenger','Warrior','Elite','Champion','Legend','Mythic','Titan','God','Unstoppable']

// ── MODAL (top-level to prevent focus loss on re-render) ──
function Modal({ onClose, title, children }) {
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:26,width:460,maxWidth:'94vw',boxShadow:'0 24px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontFamily:'Bebas Neue',fontSize:22,letterSpacing:1,marginBottom:18}}>{title}</div>
        {children}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [state, setState] = useState(null) // null = loading
  const [panel, setPanel] = useState('dashboard')
  const [routineIdx, setRoutineIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg:'', visible:false })
  // Modals
  const [habitModal, setHabitModal] = useState(null)   // null | habit obj | {id:null} for new
  const [taskModal, setTaskModal]   = useState(null)   // null | slot string
  const [routineModal, setRoutineModal] = useState(false)
  // Forms
  const [habitForm,  setHabitForm]  = useState({ name:'', emoji:'' })
  const [taskForm,   setTaskForm]   = useState({ name:'', icon:'', desc:'', slot:'morning', xp:30 })
  const [wForm,      setWForm]      = useState({ name:'', sets:'', reps:'', weight:'' })
  const [rName,      setRName]      = useState('')
  const [rDesc,      setRDesc]      = useState('')

  const saveTimer = useRef(null)

  // ── AUTH ────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push('/login'); return }
      setUser(u)
      const saved = await loadUserData(u.uid)
      const today = new Date().toDateString()
      if (saved) {
        const isNewDay = saved.lastSaved !== today
        if (isNewDay) {
          saved.challenges = saved.challenges.map(c => ({ ...c, done: false }))
          saved.habits = saved.habits.map(h => ({ ...h, done: false, streak: h.done ? h.streak + 1 : h.streak }))
          saved.workouts = []
          saved.taskDoneMap = {}
          const anyHabitDone = saved.habits.some(h => h.done) // won't be true after reset, check original
          saved.streak = anyHabitDone ? (saved.streak || 0) + 1 : saved.streak || 0
        }
        setState(saved)
      } else {
        setState(DEFAULT_STATE())
      }
    })
    return unsub
  }, [])

  // ── THEME ───────────────────────────────────────────────
  useEffect(() => {
    if (!state) return
    const t = THEMES[state.settings?.theme] || THEMES.default
    const r = document.documentElement
    Object.entries({ '--accent': t.accent, '--accent-rgb': t.accentRgb, '--bg': t.bg, '--surface': t.surface, '--surface2': t.surface2, '--border': t.border, '--text': t.text, '--muted': t.muted }).forEach(([k,v]) => r.style.setProperty(k, v))
    document.body.style.background = t.bg
  }, [state?.settings?.theme])

  // ── SAVE (debounced) ─────────────────────────────────────
  const scheduleSave = useCallback((newState) => {
    if (!user) return
    clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(async () => {
      await saveUserData(user.uid, { ...newState, lastSaved: new Date().toDateString() })
      setSaving(false)
    }, 1500)
  }, [user])

  function update(patch) {
    setState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      scheduleSave(next)
      return next
    })
  }

  // ── TOAST ───────────────────────────────────────────────
  function toast_(msg) {
    if (!state?.settings?.toasts) return
    setToast({ msg, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }

  // ── HELPERS ─────────────────────────────────────────────
  const level  = st => Math.floor((st?.xp || 0) / 1000) + 1
  const xpPct  = st => (((st?.xp || 0) % 1000) / 1000 * 100).toFixed(0)
  const dailyScore = st => st ? Math.round(st.challenges.filter(c=>c.done).length / st.challenges.length * 100) : 0

  // ── ACTIONS ──────────────────────────────────────────────
  function toggleChallenge(id) {
    update(s => {
      const c = s.challenges.find(x => x.id === id)
      const done = !c.done
      if (done) toast_(`+${c.xp} XP — "${c.name}" done! 🔥`)
      return {
        ...s,
        xp: done ? s.xp + c.xp : Math.max(0, s.xp - c.xp),
        challenges: s.challenges.map(x => x.id === id ? { ...x, done } : x)
      }
    })
  }

  function toggleHabit(id) {
    update(s => {
      const h = s.habits.find(x => x.id === id)
      const done = !h.done
      if (done) toast_(`+15 XP — ${h.emoji} ${h.name}!`)
      return {
        ...s,
        xp: done ? s.xp + 15 : Math.max(0, s.xp - 15),
        habits: s.habits.map(x => x.id === id ? { ...x, done } : x)
      }
    })
  }

  function saveHabit() {
    if (!habitForm.name.trim()) return
    update(s => {
      if (habitModal?.id) {
        return { ...s, habits: s.habits.map(h => h.id === habitModal.id ? { ...h, name: habitForm.name, emoji: habitForm.emoji || h.emoji } : h) }
      }
      return { ...s, habits: [...s.habits, { id: Date.now(), emoji: habitForm.emoji || '📌', name: habitForm.name, streak: 0, done: false }] }
    })
    setHabitModal(null)
    toast_('Habit saved! ✅')
  }

  function deleteHabit() {
    update(s => ({ ...s, habits: s.habits.filter(h => h.id !== habitModal.id) }))
    setHabitModal(null)
    toast_('Habit deleted.')
  }

  function addWorkout() {
    if (!wForm.name || !wForm.sets || !wForm.reps) { toast_('Fill exercise, sets & reps!'); return }
    update(s => ({ ...s, xp: s.xp + 20, workouts: [...s.workouts, { ...wForm, id: Date.now() }] }))
    setWForm({ name:'', sets:'', reps:'', weight:'' })
    toast_('+20 XP — Exercise logged! 💪')
  }

  function delWorkout(id) { update(s => ({ ...s, workouts: s.workouts.filter(w => w.id !== id) })) }

  function saveTask() {
    if (!taskForm.name.trim()) return
    update(s => ({
      ...s,
      routines: s.routines.map((r, i) => i !== routineIdx ? r : {
        ...r,
        tasks: { ...r.tasks, [taskForm.slot]: [...(r.tasks[taskForm.slot]||[]), { id:Date.now(), name:taskForm.name, icon:taskForm.icon||'📌', desc:taskForm.desc, xp:parseInt(taskForm.xp)||30 }] }
      })
    }))
    setTaskModal(null)
    toast_(`"${taskForm.name}" added! ✅`)
  }

  function toggleRoutineTask(rId, slot, tId) {
    update(s => {
      const key = `${rId}_${tId}`
      const done = !s.taskDoneMap[key]
      const r = s.routines.find(x => x.id === rId)
      const t = (r?.tasks[slot]||[]).find(x => x.id === tId)
      if (!t) return s
      if (done) toast_(`+${t.xp} XP — ${t.name} done! ✅`)
      return { ...s, xp: done ? s.xp + t.xp : Math.max(0, s.xp - t.xp), taskDoneMap: { ...s.taskDoneMap, [key]: done } }
    })
  }

  function delRoutineTask(rId, slot, tId) {
    update(s => ({ ...s, routines: s.routines.map(r => r.id !== rId ? r : { ...r, tasks: { ...r.tasks, [slot]: r.tasks[slot].filter(t => t.id !== tId) } }) }))
  }

  function createRoutine() {
    if (!rName.trim()) return
    const nr = { id: Date.now(), name: rName, desc: rDesc || 'Custom routine', tasks: { morning:[], afternoon:[], evening:[] } }
    update(s => ({ ...s, routines: [...s.routines, nr] }))
    setRoutineIdx(state.routines.length)
    setRoutineModal(false); setRName(''); setRDesc('')
    toast_(`"${rName}" created! 🎉`)
  }

  function delRoutine(id) {
    if (!confirm('Delete this routine?')) return
    update(s => ({ ...s, routines: s.routines.filter(r => r.id !== id) }))
    setRoutineIdx(0)
    toast_('Routine deleted.')
  }

  function resetProgress() {
    if (!confirm('Reset ALL progress? This cannot be undone.')) return
    const fresh = { ...DEFAULT_STATE(), settings: state.settings }
    setState(fresh); scheduleSave(fresh)
    toast_('Fresh start! 💪')
  }

  // ── STYLES ──────────────────────────────────────────────
  const S = {
    card:   { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20 },
    sec:    { fontFamily:'Bebas Neue', fontSize:16, letterSpacing:1.5, color:'var(--muted)', marginBottom:10 },
    btn:    { background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:8, padding:'8px 16px', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnSec: { background:'var(--surface2)', color:'var(--text)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 16px', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnDng: { background:'#f87171', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnGh:  { background:'transparent', color:'var(--accent)', border:'1px solid rgba(var(--accent-rgb),0.4)', borderRadius:8, padding:'5px 11px', fontWeight:600, fontSize:11, cursor:'pointer', fontFamily:'inherit' },
    inp:    { background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', padding:'9px 13px', fontSize:13, outline:'none', width:'100%', fontFamily:'inherit' },
    tag:    { display:'inline-block', background:'rgba(var(--accent-rgb),0.12)', color:'var(--accent)', fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:3, textTransform:'uppercase' },
    lbl:    { fontSize:10, color:'var(--muted)', display:'block', marginBottom:5 },
  }

  // ── LOADING ─────────────────────────────────────────────
  if (!state) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue', fontSize:28, color:'var(--accent)', letterSpacing:2, marginBottom:10 }}>TRACKIFY</div>
        <div style={{ color:'var(--muted)', fontSize:13 }}>Loading your data...</div>
      </div>
    </div>
  )

  const lvl = level(state)
  const routine = state.routines[routineIdx] || state.routines[0]
  const slots = [{key:'morning',label:'Morning',icon:'🌅'},{key:'afternoon',label:'Afternoon',icon:'☀️'},{key:'evening',label:'Evening',icon:'🌙'}]

  // ── PANELS ──────────────────────────────────────────────
  function Dashboard() {
    return (
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Bebas Neue', fontSize:46, lineHeight:1, letterSpacing:2, margin:0 }}>TODAY'S <span style={{color:'var(--accent)'}}>FOCUS</span></h1>
            <p style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>Stack the wins. Every day counts.</p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontFamily:'JetBrains Mono', fontSize:10, color:'var(--muted)', background:'var(--surface)', border:'1px solid var(--border)', padding:'6px 12px', borderRadius:6 }}>
              {new Date().toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'})}
            </span>
            <button style={S.btnDng} onClick={resetProgress}>↺ Reset</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Daily Score', val:`${dailyScore(state)}%`, color:'var(--accent)', sub:'challenges done' },
            { label:'🔥 Streak',   val:state.streak,            color:'#fbbf24',       sub:'days in a row' },
            { label:'Total XP',    val:state.xp,                color:'#6ee7b7',       sub:'experience points' },
          ].map(c => (
            <div key={c.label} style={S.card}>
              <div style={{fontSize:10,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:5}}>{c.label}</div>
              <div style={{fontFamily:'Bebas Neue',fontSize:38,color:c.color,lineHeight:1}}>{c.val}</div>
              <div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={S.sec}>TODAY'S CHALLENGES</div>
        <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:24 }}>
          {state.challenges.slice(0,3).map(c => (
            <div key={c.id} onClick={()=>toggleChallenge(c.id)}
              style={{...S.card, display:'flex', alignItems:'center', gap:12, cursor:'pointer', opacity:c.done?0.45:1, padding:'13px 16px', borderColor:c.done?'#6ee7b7':'var(--border)'}}>
              <span style={{fontSize:18,width:28,textAlign:'center'}}>{c.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{c.name}</div><div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>{c.why}</div></div>
              <span style={S.tag}>+{c.xp} XP</span>
              <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${c.done?'#6ee7b7':'var(--border)'}`,background:c.done?'#6ee7b7':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#000'}}>{c.done?'✓':''}</div>
            </div>
          ))}
        </div>

        <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'20px 0'}}/>
        <div style={S.sec}>HABITS TODAY</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
          {state.habits.slice(0,4).map(h => (
            <div key={h.id} onClick={()=>toggleHabit(h.id)}
              style={{...S.card,textAlign:'center',cursor:'pointer',borderColor:h.done?'var(--accent)':'var(--border)',padding:14}}>
              <div style={{fontSize:22,marginBottom:5}}>{h.emoji}</div>
              <div style={{fontSize:11,fontWeight:600}}>{h.name}</div>
              <div style={{fontSize:9,color:'var(--muted)',marginTop:2,fontFamily:'JetBrains Mono'}}>🔥 {h.done?h.streak+1:h.streak}d</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Challenges() {
    return (
      <div>
        <h1 style={{fontFamily:'Bebas Neue',fontSize:46,lineHeight:1,letterSpacing:2,marginBottom:28}}>DAILY <span style={{color:'var(--accent)'}}>CHALLENGES</span></h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
          {slots.map(sl => {
            const c = state.challenges.find(x=>x.slot===sl.key&&!x.done) || state.challenges.find(x=>x.slot===sl.key)
            return (
              <div key={sl.key} style={S.card}>
                <div style={{fontSize:10,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>{sl.icon} {sl.label}</div>
                {c && <>
                  <div style={{fontSize:20,marginBottom:5}}>{c.icon}</div>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{c.name}</div>
                  <div style={{fontSize:10,color:'var(--muted)',marginBottom:10}}>{c.why}</div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <span style={S.tag}>+{c.xp} XP</span>
                    {c.done ? <span style={{color:'#6ee7b7',fontSize:10,fontWeight:600}}>✓ Done!</span>
                      : <button style={{...S.btn,padding:'3px 10px',fontSize:10}} onClick={()=>toggleChallenge(c.id)}>Complete</button>}
                  </div>
                </>}
              </div>
            )
          })}
        </div>
        <div style={S.sec}>ALL CHALLENGES</div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {state.challenges.map(c => (
            <div key={c.id} onClick={()=>toggleChallenge(c.id)}
              style={{...S.card,display:'flex',alignItems:'center',gap:12,cursor:'pointer',opacity:c.done?0.4:1,padding:'13px 16px',borderColor:c.done?'#6ee7b7':'var(--border)'}}>
              <span style={{fontSize:18,width:28,textAlign:'center'}}>{c.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{c.name}</div><div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>{c.why}</div></div>
              <span style={{fontFamily:'JetBrains Mono',fontSize:9,color:'var(--muted)',background:'var(--surface2)',padding:'3px 6px',borderRadius:4}}>{c.time}</span>
              <span style={S.tag}>+{c.xp} XP</span>
              <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${c.done?'#6ee7b7':'var(--border)'}`,background:c.done?'#6ee7b7':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#000'}}>{c.done?'✓':''}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Habits() {
    const done = state.habits.filter(h=>h.done).length
    return (
      <div>
        <h1 style={{fontFamily:'Bebas Neue',fontSize:46,lineHeight:1,letterSpacing:2,marginBottom:4}}>HABIT <span style={{color:'var(--accent)'}}>TRACKER</span></h1>
        <p style={{color:'var(--muted)',fontSize:12,marginBottom:24}}>Right-click any habit to edit or delete it.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9,marginBottom:20}}>
          {state.habits.map(h => (
            <div key={h.id} onClick={()=>toggleHabit(h.id)}
              onContextMenu={e=>{e.preventDefault();setHabitModal(h);setHabitForm({name:h.name,emoji:h.emoji})}}
              style={{...S.card,textAlign:'center',cursor:'pointer',position:'relative',borderColor:h.done?'var(--accent)':'var(--border)',padding:14}}>
              {h.done && <div style={{position:'absolute',top:7,right:7,fontSize:11,color:'var(--accent)'}}>✓</div>}
              <div style={{fontSize:24,marginBottom:5}}>{h.emoji}</div>
              <div style={{fontSize:11,fontWeight:600}}>{h.name}</div>
              <div style={{fontSize:9,color:'var(--muted)',marginTop:2,fontFamily:'JetBrains Mono'}}>🔥 {h.done?h.streak+1:h.streak}d</div>
            </div>
          ))}
          <div onClick={()=>{setHabitModal({id:null});setHabitForm({name:'',emoji:''})}}
            style={{...S.card,textAlign:'center',cursor:'pointer',border:'1px dashed var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4,padding:14}}>
            <div style={{fontSize:22,color:'var(--muted)'}}>+</div>
            <div style={{fontSize:10,color:'var(--muted)',fontWeight:600}}>Add Habit</div>
          </div>
        </div>
        <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'20px 0'}}/>
        <div style={S.sec}>PROGRESS</div>
        {[
          {label:"Today's Habits",val:`${done}/${state.habits.length}`,pct:Math.round(done/state.habits.length*100),color:'var(--accent)'},
          {label:'Avg Streak',val:`${Math.round(state.habits.reduce((a,h)=>a+h.streak,0)/state.habits.length)}d`,pct:Math.min(100,Math.round(state.habits.reduce((a,h)=>a+h.streak,0)/state.habits.length/14*100)),color:'#fbbf24'},
        ].map(p => (
          <div key={p.label} style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span>{p.label}</span><span style={{color:p.color,fontFamily:'JetBrains Mono'}}>{p.val}</span></div>
            <div style={{background:'var(--border)',borderRadius:5,height:6}}><div style={{width:`${p.pct}%`,background:p.color,borderRadius:5,height:6,transition:'width 0.5s'}}></div></div>
          </div>
        ))}
      </div>
    )
  }

  function Workout() {
    const totalSets = state.workouts.reduce((a,w)=>a+parseInt(w.sets||0),0)
    return (
      <div>
        <h1 style={{fontFamily:'Bebas Neue',fontSize:46,lineHeight:1,letterSpacing:2,marginBottom:28}}>WORKOUT <span style={{color:'var(--accent)'}}>LOG</span></h1>
        <div style={{...S.card,marginBottom:18}}>
          <div style={S.sec}>ADD EXERCISE</div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:8,marginBottom:8}}>
            <input style={S.inp} placeholder="Exercise name" value={wForm.name} onChange={e=>setWForm(f=>({...f,name:e.target.value}))} />
            <input style={S.inp} placeholder="Sets" type="number" value={wForm.sets} onChange={e=>setWForm(f=>({...f,sets:e.target.value}))} />
            <input style={S.inp} placeholder="Reps" type="number" value={wForm.reps} onChange={e=>setWForm(f=>({...f,reps:e.target.value}))} />
            <input style={S.inp} placeholder="kg" type="number" value={wForm.weight} onChange={e=>setWForm(f=>({...f,weight:e.target.value}))} />
            <button style={S.btn} onClick={addWorkout}>+ ADD</button>
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['Push-ups','3','15','0'],['Pull-ups','3','10','0'],['Squat','4','8','60'],['Deadlift','3','5','80'],['Plank','3','60s','0'],['OHP','3','8','40']].map(([n,s,r,w])=>(
              <button key={n} style={{...S.btnSec,fontSize:10,padding:'4px 10px'}} onClick={()=>setWForm({name:n,sets:s,reps:r,weight:w})}>{n}</button>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={S.sec}>TODAY'S SESSION</div>
            {state.workouts.length>0 && <span style={{fontFamily:'JetBrains Mono',fontSize:10,color:'var(--muted)'}}>{state.workouts.length} exercises · {totalSets} sets</span>}
          </div>
          {!state.workouts.length
            ? <div style={{textAlign:'center',padding:30,color:'var(--muted)',fontSize:12}}>No exercises yet. Add your first set above.</div>
            : state.workouts.map(w => (
              <div key={w.id} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:8,padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontWeight:500,fontSize:13}}>{w.name}</span>
                <span style={{color:'var(--muted)',fontFamily:'JetBrains Mono',fontSize:11}}>{w.sets}</span>
                <span style={{color:'var(--muted)',fontFamily:'JetBrains Mono',fontSize:11}}>{w.reps}</span>
                <span style={{color:'var(--muted)',fontFamily:'JetBrains Mono',fontSize:11}}>{+w.weight>0?w.weight+'kg':'BW'}</span>
                <button onClick={()=>delWorkout(w.id)} style={{background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:14}}>✕</button>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  function Routines() {
    return (
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:28}}>
          <div>
            <h1 style={{fontFamily:'Bebas Neue',fontSize:46,lineHeight:1,letterSpacing:2,margin:0}}>MY <span style={{color:'var(--accent)'}}>ROUTINES</span></h1>
            <p style={{color:'var(--muted)',fontSize:12,marginTop:4}}>Build and customize your daily structure.</p>
          </div>
          <button style={S.btn} onClick={()=>setRoutineModal(true)}>+ New Routine</button>
        </div>
        {/* Tabs */}
        <div style={{display:'flex',gap:3,marginBottom:18,background:'var(--surface2)',padding:3,borderRadius:9,width:'fit-content',flexWrap:'wrap'}}>
          {state.routines.map((r,i) => (
            <div key={r.id} onClick={()=>setRoutineIdx(i)}
              style={{padding:'6px 16px',borderRadius:7,cursor:'pointer',fontSize:12,fontWeight:500,background:i===routineIdx?'var(--accent)':'transparent',color:i===routineIdx?'var(--bg)':'var(--muted)'}}>
              {r.name}
            </div>
          ))}
        </div>
        {routine && <>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:17,fontWeight:600}}>{routine.name}</div>
              <div style={{fontSize:11,color:'var(--muted)'}}>{routine.desc}</div>
            </div>
            {state.routines.length>1 && <button style={{...S.btnDng,marginLeft:'auto',fontSize:10,padding:'4px 11px'}} onClick={()=>delRoutine(routine.id)}>Delete</button>}
          </div>
          {slots.map(sl => (
            <div key={sl.key} style={{marginBottom:22}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:30,height:30,borderRadius:7,background:'rgba(var(--accent-rgb),0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{sl.icon}</div>
                <div style={{fontWeight:600,fontSize:14}}>{sl.label}</div>
                <button style={{...S.btnGh,marginLeft:'auto'}} onClick={()=>{setTaskModal(sl.key);setTaskForm({name:'',icon:'',desc:'',slot:sl.key,xp:30})}}>+ Add Task</button>
              </div>
              {!(routine.tasks[sl.key]||[]).length
                ? <div style={{textAlign:'center',padding:14,color:'var(--muted)',fontSize:11,background:'var(--surface2)',borderRadius:8}}>No tasks yet — add one above.</div>
                : (routine.tasks[sl.key]||[]).map(t => {
                  const done = !!state.taskDoneMap[`${routine.id}_${t.id}`]
                  return (
                    <div key={t.id} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,padding:'11px 14px',display:'flex',alignItems:'center',gap:10,marginBottom:5,opacity:done?0.42:1}}>
                      <span style={{fontSize:16,width:24,textAlign:'center'}}>{t.icon}</span>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{t.name}</div><div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>{t.desc}</div></div>
                      <span style={S.tag}>+{t.xp}xp</span>
                      <button style={{...S.btn,fontSize:10,padding:'3px 9px',background:done?'var(--surface)':undefined,color:done?'var(--text)':undefined,border:done?'1px solid var(--border)':undefined}} onClick={()=>toggleRoutineTask(routine.id,sl.key,t.id)}>{done?'↩':'✓'}</button>
                      <button style={{...S.btnDng,fontSize:10,padding:'3px 7px'}} onClick={()=>delRoutineTask(routine.id,sl.key,t.id)}>✕</button>
                    </div>
                  )
                })}
            </div>
          ))}
        </>}
      </div>
    )
  }

  function Settings() {
    return (
      <div>
        <h1 style={{fontFamily:'Bebas Neue',fontSize:46,lineHeight:1,letterSpacing:2,marginBottom:28}}>APP <span style={{color:'var(--accent)'}}>SETTINGS</span></h1>
        {/* Theme */}
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:'Bebas Neue',fontSize:16,letterSpacing:1,color:'var(--muted)',marginBottom:12}}>🎨 THEME</div>
          <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
            {Object.entries(THEMES).map(([id,t]) => (
              <div key={id} onClick={()=>update(s=>({...s,settings:{...s.settings,theme:id}}))}
                style={{width:76,cursor:'pointer',borderRadius:9,overflow:'hidden',border:`2px solid ${state.settings.theme===id?'var(--accent)':'transparent'}`,transition:'all 0.2s'}}>
                <div style={{height:46,display:'grid',gridTemplateColumns:'1fr 1fr'}}>
                  <div style={{background:t.bg}}></div><div style={{background:t.surface}}></div>
                  <div style={{background:t.accent}}></div><div style={{background:t.surface2}}></div>
                </div>
                <div style={{background:t.bg,padding:'5px 7px',fontSize:9,fontWeight:600,textAlign:'center',color:t.accent,textTransform:'capitalize'}}>{id}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Toggles */}
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:'Bebas Neue',fontSize:16,letterSpacing:1,color:'var(--muted)',marginBottom:12}}>🔔 PREFERENCES</div>
          {[{key:'toasts',label:'XP Toast Notifications',sub:'Pop-ups when you earn XP'}].map(p => (
            <div key={p.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,marginBottom:6}}>
              <div><div style={{fontSize:13,fontWeight:500}}>{p.label}</div><div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>{p.sub}</div></div>
              <div onClick={()=>update(s=>({...s,settings:{...s.settings,[p.key]:!s.settings[p.key]}}))}
                style={{width:40,height:21,borderRadius:11,cursor:'pointer',position:'relative',background:state.settings[p.key]?'var(--accent)':'var(--border)',transition:'background 0.2s'}}>
                <div style={{position:'absolute',width:15,height:15,background:'white',borderRadius:'50%',top:3,left:state.settings[p.key]?22:3,transition:'left 0.2s'}}></div>
              </div>
            </div>
          ))}
        </div>
        {/* Danger */}
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:'Bebas Neue',fontSize:16,letterSpacing:1,color:'var(--muted)',marginBottom:12}}>⚠️ DANGER ZONE</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 16px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10}}>
            <div><div style={{fontSize:13,fontWeight:500}}>Reset All Progress</div><div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>Clears XP, streaks, completions</div></div>
            <button style={S.btnDng} onClick={resetProgress}>Reset</button>
          </div>
        </div>
        {/* Support */}
        <div style={{fontFamily:'Bebas Neue',fontSize:16,letterSpacing:1,color:'var(--muted)',marginBottom:12}}>☕ SUPPORT</div>
        <div style={{...S.card,textAlign:'center'}}>
          <div style={{fontSize:28,marginBottom:8}}>🇮🇳</div>
          <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>Made in India by a teen dev</div>
          <div style={{color:'var(--muted)',fontSize:13,marginBottom:18,lineHeight:1.6}}>Built entirely with AI — without writing a single line of code by hand.</div>

        </div>
      </div>
    )
  }

  const PANELS = { dashboard:<Dashboard/>, challenges:<Challenges/>, habits:<Habits/>, workout:<Workout/>, routines:<Routines/>, settings:<Settings/> }

  // Modal is defined outside to prevent focus loss on re-render

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>

      {/* SIDEBAR */}
      <nav style={{width:230,minHeight:'100vh',background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,zIndex:100}}>
        <div style={{padding:'22px 20px 14px',fontFamily:'Bebas Neue',fontSize:22,letterSpacing:2,color:'var(--accent)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:7,height:7,background:'var(--accent)',borderRadius:'50%',boxShadow:'0 0 8px rgba(var(--accent-rgb),0.9)',flexShrink:0}}></div>
          TRACKIFY
        </div>
        <div style={{padding:'10px 0',flex:1}}>
          {[
            {section:'Main',items:[{id:'dashboard',icon:'⚡',label:'Dashboard'},{id:'challenges',icon:'🎯',label:'Challenges'},{id:'habits',icon:'🔥',label:'Habits'},{id:'workout',icon:'💪',label:'Workout'}]},
            {section:'Customize',items:[{id:'routines',icon:'📋',label:'My Routines'},{id:'settings',icon:'⚙️',label:'Settings'}]},
          ].map(group => (
            <div key={group.section}>
              <div style={{padding:'10px 20px 3px',fontSize:9,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.5}}>{group.section}</div>
              {group.items.map(n => (
                <div key={n.id} onClick={()=>setPanel(n.id)}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',cursor:'pointer',fontSize:13,fontWeight:500,color:panel===n.id?'var(--accent)':'var(--muted)',borderLeft:`2px solid ${panel===n.id?'var(--accent)':'transparent'}`,background:panel===n.id?'rgba(var(--accent-rgb),0.07)':'transparent'}}>
                  <span style={{fontSize:14,width:18,textAlign:'center'}}>{n.icon}</span>{n.label}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Level badge */}
        <div style={{margin:'10px 12px 8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:12,padding:'16px 18px',transition:'all 0.3s'}}>
          <div style={{fontSize:10,color:'var(--muted)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:4}}>Level</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:2}}>
            <div style={{fontFamily:'Bebas Neue',fontSize:48,color:'var(--accent)',lineHeight:1,textShadow:'0 0 20px rgba(var(--accent-rgb),0.4)'}}>{lvl}</div>
            <div style={{fontSize:13,color:'var(--accent)',fontWeight:600}}>{LEVEL_TAGS[Math.min(lvl,10)]}</div>
          </div>
          <div style={{background:'var(--border)',borderRadius:4,height:5,marginTop:10}}>
            <div style={{background:'var(--accent)',borderRadius:4,height:5,width:`${xpPct(state)}%`,transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',boxShadow:'0 0 8px rgba(var(--accent-rgb),0.6)'}}></div>
          </div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:6,fontFamily:'JetBrains Mono'}}>{state.xp % 1000} / 1000 XP</div>
        </div>
        {/* User */}
        <div style={{padding:'12px 16px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(var(--accent-rgb),0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--accent)',fontWeight:600}}>
            {user?.displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{flex:1,overflow:'hidden'}}>
            <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.displayName || 'User'}</div>
            <div style={{fontSize:9,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
          </div>
          <button onClick={async()=>{await logOut();router.push('/')}} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:16}} title="Logout">→</button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{marginLeft:230,flex:1,padding:'34px 42px',minHeight:'100vh'}}>
        {PANELS[panel]}
      </main>

      {/* TOAST */}
      <div style={{position:'fixed',bottom:22,right:22,background:'var(--accent)',color:'var(--bg)',fontWeight:600,fontSize:12,padding:'11px 18px',borderRadius:9,zIndex:999,transform:toast.visible?'translateY(0)':'translateY(80px)',opacity:toast.visible?1:0,transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',maxWidth:270,pointerEvents:'none'}}>
        {toast.msg}
      </div>

      {/* SAVING */}
      {saving && <div style={{position:'fixed',top:12,right:12,background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,padding:'5px 12px',fontSize:10,color:'var(--muted)',zIndex:999}}>Saving...</div>}

      {/* HABIT MODAL */}
      {habitModal !== null && (
        <Modal onClose={()=>setHabitModal(null)} title={<>{habitModal.id?'EDIT':'ADD'} <span style={{color:'var(--accent)'}}>HABIT</span></>}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:10}}>
            <div><label style={S.lbl}>Habit Name *</label><input style={S.inp} value={habitForm.name} onChange={e=>setHabitForm(f=>({...f,name:e.target.value}))} placeholder="Drink Water" /></div>
            <div><label style={S.lbl}>Emoji</label><input style={S.inp} value={habitForm.emoji} onChange={e=>setHabitForm(f=>({...f,emoji:e.target.value}))} placeholder="💧" maxLength={2} /></div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
            <button style={S.btnSec} onClick={()=>setHabitModal(null)}>Cancel</button>
            {habitModal.id && <button style={S.btnDng} onClick={deleteHabit}>Delete</button>}
            <button style={S.btn} onClick={saveHabit}>Save</button>
          </div>
        </Modal>
      )}

      {/* TASK MODAL */}
      {taskModal !== null && (
        <Modal onClose={()=>setTaskModal(null)} title={<>ADD TASK TO <span style={{color:'var(--accent)'}}>{taskModal?.toUpperCase()}</span></>}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:10}}>
            <div><label style={S.lbl}>Task Name *</label><input style={S.inp} value={taskForm.name} onChange={e=>setTaskForm(f=>({...f,name:e.target.value}))} placeholder="Cold Shower" /></div>
            <div><label style={S.lbl}>Emoji</label><input style={S.inp} value={taskForm.icon} onChange={e=>setTaskForm(f=>({...f,icon:e.target.value}))} placeholder="🚿" maxLength={2} /></div>
          </div>
          <div style={{marginBottom:10}}><label style={S.lbl}>Description</label><input style={S.inp} value={taskForm.desc} onChange={e=>setTaskForm(f=>({...f,desc:e.target.value}))} placeholder="Why this matters" /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
            <div><label style={S.lbl}>Time Slot</label>
              <select style={S.inp} value={taskForm.slot} onChange={e=>setTaskForm(f=>({...f,slot:e.target.value}))}>
                <option value="morning">🌅 Morning</option><option value="afternoon">☀️ Afternoon</option><option value="evening">🌙 Evening</option>
              </select>
            </div>
            <div><label style={S.lbl}>XP Reward</label><input style={S.inp} type="number" value={taskForm.xp} onChange={e=>setTaskForm(f=>({...f,xp:e.target.value}))} /></div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
            <button style={S.btnSec} onClick={()=>setTaskModal(null)}>Cancel</button>
            <button style={S.btn} onClick={saveTask}>Add Task</button>
          </div>
        </Modal>
      )}

      {/* NEW ROUTINE MODAL */}
      {routineModal && (
        <Modal onClose={()=>setRoutineModal(false)} title={<>CREATE <span style={{color:'var(--accent)'}}>ROUTINE</span></>}>
          <div style={{marginBottom:10}}><label style={S.lbl}>Routine Name *</label><input style={S.inp} value={rName} onChange={e=>setRName(e.target.value)} placeholder="Gym Day" /></div>
          <div><label style={S.lbl}>Description</label><input style={S.inp} value={rDesc} onChange={e=>setRDesc(e.target.value)} placeholder="What's this for?" /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
            <button style={S.btnSec} onClick={()=>setRoutineModal(false)}>Cancel</button>
            <button style={S.btn} onClick={createRoutine}>Create</button>
          </div>
        </Modal>
      )}

    </div>
  )
}
