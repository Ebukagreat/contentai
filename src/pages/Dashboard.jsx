import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import PaywallModal from '../components/PaywallModal'
import { generateContent, CONTENT_TYPES } from '../lib/ai'
import { signOut, useCredit, saveGeneration, getGenerations } from '../lib/supabase'

export default function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('product')
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('generator')

  useEffect(() => { if (!loading && !user) navigate('/auth') }, [user, loading])
  useEffect(() => { if (user) getGenerations(user.id, 10).then(setHistory).catch(() => {}) }, [user])

  async function handleGenerate() {
    if (!prompt.trim()) return
    const isPro = profile?.plan === 'pro'
    if (!isPro && (profile?.credits ?? 0) <= 0) { setShowPaywall(true); return }
    setGenerating(true); setError(''); setOutput('')
    try {
      const result = await generateContent(type, prompt)
      setOutput(result)
      if (!isPro) { await useCredit(user.id); refreshProfile() }
      await saveGeneration(user.id, type, prompt, result)
      setHistory(await getGenerations(user.id, 10))
    } catch (err) { setError(err.message || 'Generation failed. Please check your Gemini API key.') }
    finally { setGenerating(false) }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const isPro = profile?.plan === 'pro'
  const credits = profile?.credits ?? 0
  const totalWords = history.reduce((s, g) => s + (g.word_count || 0), 0)

  if (loading) return <div style={S.loader}><div style={S.spin} /></div>

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logo}><span style={{ color:'#A78BFA' }}>✦</span><span style={S.logoText}>ContentAI</span></div>
        <nav style={S.nav}>
          {[['generator','✦','Generator'],['history','◷','History'],['settings','⚙','Settings']].map(([id,icon,label]) => (
            <button key={id} style={tab===id ? {...S.navItem,...S.navActive} : S.navItem} onClick={() => setTab(id)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={S.foot}>
          <div style={S.creditBox}>
            <div style={S.creditLabel}>Credits</div>
            <div style={S.creditVal}>{isPro ? '∞ Unlimited' : `${credits} remaining`}</div>
            <div style={S.bar}><div style={{ ...S.barFill, width: isPro ? '100%' : `${Math.min((credits/5)*100,100)}%` }} /></div>
          </div>
          {!isPro && <button style={S.upgradeBtn} onClick={() => setShowPaywall(true)}>⚡ Upgrade to Pro</button>}
          <div style={S.userRow}>
            <div style={S.avatar}>{(profile?.full_name || user?.email || 'U')[0].toUpperCase()}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={S.userName}>{profile?.full_name || 'User'}</div>
              <div style={S.userPlan}>{isPro ? '✦ Pro plan' : 'Free plan'}</div>
            </div>
            <button style={S.signOut} onClick={async () => { await signOut(); navigate('/auth') }} title="Sign out">→</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>

        {tab === 'generator' && <>
          <div style={S.statsRow}>
            {[['Generations', history.length], ['Words written', totalWords.toLocaleString()], ['Time saved', `${Math.round(totalWords/40)}m`]].map(([label, val]) => (
              <div key={label} style={S.statCard}>
                <div style={S.statLabel}>{label}</div>
                <div style={S.statVal}>{val}</div>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <h2 style={S.cardTitle}>Generate content</h2>
            <div style={S.typeGrid}>
              {CONTENT_TYPES.map(ct => (
                <button key={ct.value} style={type===ct.value ? {...S.typeBtn,...S.typeBtnOn} : S.typeBtn} onClick={() => setType(ct.value)}>
                  <span>{ct.icon}</span><span style={{ fontSize:12 }}>{ct.label}</span>
                </button>
              ))}
            </div>
            <textarea
              style={S.textarea}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Describe your business and what you need...\ne.g. "A suya spot in Lagos targeting young professionals"`}
              rows={4}
            />
            <button style={generating ? {...S.genBtn, opacity:0.6} : S.genBtn} onClick={handleGenerate} disabled={generating}>
              {generating ? '✦  Writing your content...' : '✦  Generate'}
            </button>
            {error && <div style={S.errorBox}>{error}</div>}
            {output && (
              <div style={S.outputBox}>
                <div style={S.outputHead}>
                  <span style={{ fontSize:12,color:'#666',fontWeight:500 }}>Your content</span>
                  <button style={S.copyBtn} onClick={handleCopy}>{copied ? '✓ Copied!' : 'Copy'}</button>
                </div>
                <div style={S.outputText}>{output.split('\n').map((l,i) => <span key={i}>{l}<br /></span>)}</div>
              </div>
            )}
          </div>
        </>}

        {tab === 'history' && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Generation history</h2>
            {history.length === 0
              ? <p style={{ color:'#555',fontSize:14 }}>No history yet. Generate some content first.</p>
              : history.map(item => (
                <div key={item.id} style={S.histItem}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4 }}>
                    <span style={{ fontSize:12,color:'#A78BFA',fontWeight:500 }}>
                      {CONTENT_TYPES.find(t=>t.value===item.type)?.icon} {CONTENT_TYPES.find(t=>t.value===item.type)?.label}
                    </span>
                    <span style={{ fontSize:11,color:'#555' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize:13,color:'#888',fontStyle:'italic',marginBottom:4 }}>{item.prompt}</div>
                  <div style={{ fontSize:13,color:'#666',lineHeight:1.5 }}>{item.output?.slice(0,180)}...</div>
                  <button style={S.reuseBtn} onClick={() => { setType(item.type); setPrompt(item.prompt); setOutput(item.output); setTab('generator') }}>
                    Reuse →
                  </button>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'settings' && (
          <div style={S.card}>
            <h2 style={S.cardTitle}>Account settings</h2>
            {[['Email', user?.email], ['Plan', isPro ? 'Pro' : 'Free'], ['Credits', isPro ? 'Unlimited' : credits]].map(([label, val]) => (
              <div key={label} style={S.settingRow}>
                <span style={{ fontSize:14,color:'#888' }}>{label}</span>
                <span style={{ fontSize:14,color:'#fff',fontWeight:500 }}>{val}</span>
              </div>
            ))}
            {!isPro && <button style={{ ...S.upgradeBtn, marginTop:16 }} onClick={() => setShowPaywall(true)}>⚡ Upgrade to Pro</button>}
          </div>
        )}
      </main>

      {showPaywall && <PaywallModal onClose={() => { setShowPaywall(false); refreshProfile() }} />}
    </div>
  )
}

const S = {
  loader: { minHeight:'100vh',background:'#0A0A0A',display:'flex',alignItems:'center',justifyContent:'center' },
  spin: { width:32,height:32,border:'2px solid #333',borderTop:'2px solid #A78BFA',borderRadius:'50%',animation:'spin 0.7s linear infinite' },
  page: { minHeight:'100vh',display:'flex',background:'#0A0A0A',fontFamily:"'DM Sans',sans-serif",color:'#fff' },
  sidebar: { width:220,background:'#0f0f0f',borderRight:'1px solid #1e1e1e',padding:'1.5rem 1rem',display:'flex',flexDirection:'column',gap:4,flexShrink:0,position:'sticky',top:0,height:'100vh' },
  logo: { display:'flex',alignItems:'center',gap:8,marginBottom:'2rem',fontSize:18 },
  logoText: { fontSize:16,fontWeight:600,color:'#fff',letterSpacing:'-0.3px' },
  nav: { display:'flex',flexDirection:'column',gap:2 },
  navItem: { display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,fontSize:13,color:'#666',cursor:'pointer',background:'none',border:'none',fontFamily:"'DM Sans',sans-serif",textAlign:'left',width:'100%' },
  navActive: { background:'#1a1a1a',color:'#fff' },
  foot: { marginTop:'auto',display:'flex',flexDirection:'column',gap:10 },
  creditBox: { background:'#1a1a1a',borderRadius:10,padding:'10px 12px' },
  creditLabel: { fontSize:11,color:'#666',marginBottom:4 },
  creditVal: { fontSize:13,fontWeight:500,color:'#fff',marginBottom:8 },
  bar: { height:3,background:'#2a2a2a',borderRadius:99 },
  barFill: { height:'100%',background:'#A78BFA',borderRadius:99,transition:'width 0.3s' },
  upgradeBtn: { width:'100%',padding:9,background:'#A78BFA',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  userRow: { display:'flex',alignItems:'center',gap:8,padding:'8px 0' },
  avatar: { width:30,height:30,borderRadius:'50%',background:'#1e1433',color:'#A78BFA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600,flexShrink:0 },
  userName: { fontSize:12,fontWeight:500,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' },
  userPlan: { fontSize:11,color:'#666' },
  signOut: { background:'none',border:'none',color:'#444',cursor:'pointer',fontSize:14,padding:0 },
  main: { flex:1,padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem',maxWidth:760 },
  statsRow: { display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 },
  statCard: { background:'#141414',border:'1px solid #1e1e1e',borderRadius:10,padding:'1rem' },
  statLabel: { fontSize:11,color:'#666',marginBottom:4 },
  statVal: { fontSize:22,fontWeight:600,color:'#fff' },
  card: { background:'#141414',border:'1px solid #1e1e1e',borderRadius:14,padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem' },
  cardTitle: { fontSize:16,fontWeight:600,color:'#fff',letterSpacing:'-0.3px' },
  typeGrid: { display:'flex',flexWrap:'wrap',gap:6 },
  typeBtn: { display:'flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:8,border:'1px solid #2a2a2a',background:'#1a1a1a',color:'#888',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all 0.15s' },
  typeBtnOn: { border:'1px solid #A78BFA',color:'#A78BFA',background:'#0e0b1a' },
  textarea: { background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:10,padding:12,color:'#fff',fontSize:14,resize:'vertical',fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,outline:'none' },
  genBtn: { padding:13,background:'#A78BFA',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",letterSpacing:'-0.2px' },
  errorBox: { color:'#f87171',fontSize:13,padding:'8px 12px',background:'#1a0f0f',borderRadius:8 },
  outputBox: { background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:10,overflow:'hidden' },
  outputHead: { display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid #2a2a2a' },
  copyBtn: { background:'#222',border:'1px solid #333',borderRadius:6,padding:'4px 10px',color:'#aaa',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  outputText: { padding:14,fontSize:14,color:'#ccc',lineHeight:1.8 },
  histItem: { background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:10,padding:14,display:'flex',flexDirection:'column',gap:4,marginBottom:8 },
  reuseBtn: { alignSelf:'flex-start',background:'none',border:'1px solid #333',borderRadius:6,color:'#888',fontSize:12,padding:'4px 10px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",marginTop:4 },
  settingRow: { display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #1e1e1e' },
}
