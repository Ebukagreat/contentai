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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    } catch (err) { setError(err.message || 'Generation failed. Please try again.') }
    finally { setGenerating(false) }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const isPro = profile?.plan === 'pro'
  const credits = profile?.credits ?? 0
  const totalWords = history.reduce((s, g) => s + (g.word_count || 0), 0)

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#050510',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:16,animation:'float 2s ease-in-out infinite'}}>✦</div>
        <div style={{fontSize:14,color:'#6b679a'}}>Loading ContentAI...</div>
      </div>
    </div>
  )

  const navItems = [['generator','✦','Generator'],['history','◷','History'],['settings','⚙','Settings']]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050510; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes glow { 0%,100%{opacity:0.4}50%{opacity:0.8} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.3)}50%{box-shadow:0 0 0 8px rgba(167,139,250,0)} }
        .gen-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(167,139,250,0.35) !important; }
        .nav-btn:hover { background: rgba(167,139,250,0.08) !important; color: #fff !important; }
        .type-btn:hover { border-color: rgba(167,139,250,0.3) !important; background: rgba(167,139,250,0.05) !important; }
        .hist-card:hover { border-color: rgba(167,139,250,0.25) !important; transform: translateY(-2px); }
        .hist-card { transition: all 0.2s; }

        /* Mobile styles */
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-nav { display: flex !important; }
          .main-content { padding: 1rem !important; }
          .page-header { flex-direction: column !important; gap: 12px !important; }
          .stats-row { width: 100%; justify-content: stretch !important; }
          .stat-pill { flex: 1 !important; }
          .type-grid { grid-template-columns: repeat(2,1fr) !important; }
          .history-grid { grid-template-columns: 1fr !important; }
          .settings-card { padding: 1rem !important; }
          .output-header { flex-direction: column !important; gap: 8px !important; align-items: flex-start !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      <div style={{minHeight:'100vh',display:'flex',background:'#050510',fontFamily:"'DM Sans',sans-serif",color:'#fff',position:'relative'}}>

        {/* BG orbs */}
        <div style={{position:'fixed',top:'5%',left:'15%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 70%)',pointerEvents:'none',zIndex:0,animation:'glow 5s ease-in-out infinite'}} />
        <div style={{position:'fixed',bottom:'10%',right:'5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(96,165,250,0.04) 0%,transparent 70%)',pointerEvents:'none',zIndex:0,animation:'glow 6s ease-in-out infinite 2s'}} />

        {/* DESKTOP SIDEBAR */}
        <aside className="desktop-sidebar" style={{width:250,background:'rgba(10,9,24,0.95)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(167,139,250,0.08)',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'sticky',top:0,height:'100vh',flexShrink:0,zIndex:10}}>
          <div style={{padding:'1.5rem 1rem'}}>
            {/* Logo */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'2.5rem',padding:'0 6px'}}>
              <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,boxShadow:'0 0 20px rgba(167,139,250,0.4)',flexShrink:0}}>✦</div>
              <div>
                <div style={{fontSize:17,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',lineHeight:1}}>ContentAI</div>
                <div style={{fontSize:8,color:'#A78BFA',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',marginTop:2}}>Nigerian Business AI</div>
              </div>
            </div>

            <nav style={{display:'flex',flexDirection:'column',gap:4}}>
              {navItems.map(([id,icon,label]) => (
                <button key={id} className="nav-btn" onClick={() => setTab(id)} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:12,fontSize:14,color:tab===id?'#fff':'#6b679a',cursor:'pointer',background:tab===id?'rgba(167,139,250,0.12)':'none',border:'none',fontFamily:"'DM Sans',sans-serif",textAlign:'left',width:'100%',position:'relative',transition:'all 0.15s',fontWeight:tab===id?600:400}}>
                  <span style={{fontSize:16,color:tab===id?'#A78BFA':'#6b679a',width:20,textAlign:'center'}}>{icon}</span>
                  {label}
                  {tab===id && <div style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',width:3,height:22,borderRadius:'3px 0 0 3px',background:'linear-gradient(180deg,#A78BFA,#7C3AED)'}} />}
                </button>
              ))}
            </nav>
          </div>

          <div style={{padding:'1rem',borderTop:'1px solid rgba(167,139,250,0.08)'}}>
            {/* Credit card */}
            <div style={{background:'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(124,58,237,0.08))',border:'1px solid rgba(167,139,250,0.15)',borderRadius:14,padding:'1rem',marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:11,color:'#6b679a',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>Credits</span>
                <span style={{fontSize:9,fontWeight:700,background:isPro?'linear-gradient(135deg,#A78BFA,#7C3AED)':'rgba(167,139,250,0.15)',color:'#fff',padding:'2px 8px',borderRadius:99,letterSpacing:'0.5px'}}>{isPro?'PRO':'FREE'}</span>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:'#fff',marginBottom:10,lineHeight:1}}>{isPro?'∞':credits} <span style={{fontSize:12,fontWeight:400,color:'#6b679a'}}>{isPro?'unlimited':'remaining'}</span></div>
              <div style={{height:5,background:'rgba(255,255,255,0.05)',borderRadius:99,overflow:'hidden',marginBottom:10}}>
                <div style={{height:'100%',borderRadius:99,background:isPro?'linear-gradient(90deg,#A78BFA,#7C3AED)':credits>2?'linear-gradient(90deg,#A78BFA,#7C3AED)':'linear-gradient(90deg,#f87171,#ef4444)',width:isPro?'100%':`${Math.min((credits/5)*100,100)}%`,transition:'width 0.3s'}} />
              </div>
              {!isPro && <button onClick={() => setShowPaywall(true)} style={{width:'100%',padding:'9px',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:9,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 15px rgba(167,139,250,0.3)',animation:'pulse 2s infinite'}}>⚡ Upgrade to Pro</button>}
            </div>

            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,flexShrink:0,boxShadow:'0 0 10px rgba(167,139,250,0.3)'}}>{(profile?.full_name||user?.email||'U')[0].toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{profile?.full_name||'User'}</div>
                <div style={{fontSize:11,color:'#4a4875',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email?.slice(0,24)}</div>
              </div>
              <button onClick={async()=>{await signOut();navigate('/auth')}} title="Sign out" style={{background:'rgba(255,255,255,0.04)',border:'1px solid #1a1830',color:'#6b679a',cursor:'pointer',fontSize:13,padding:'6px 8px',borderRadius:8,flexShrink:0}}>⇥</button>
            </div>
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <div className="mobile-header" style={{display:'none',position:'fixed',top:0,left:0,right:0,height:60,background:'rgba(5,5,16,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(167,139,250,0.1)',alignItems:'center',justifyContent:'space-between',padding:'0 1rem',zIndex:100}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,boxShadow:'0 0 12px rgba(167,139,250,0.4)'}}>✦</div>
            <div>
              <div style={{fontSize:15,fontWeight:900,color:'#fff',letterSpacing:'-0.3px',lineHeight:1}}>ContentAI</div>
              <div style={{fontSize:7,color:'#A78BFA',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>Nigerian Business AI</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {!isPro && <button onClick={()=>setShowPaywall(true)} style={{background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:8,padding:'6px 12px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>⚡ Pro</button>}
            <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800}}>{(profile?.full_name||user?.email||'U')[0].toUpperCase()}</div>
          </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="mobile-nav" style={{display:'none',position:'fixed',bottom:0,left:0,right:0,height:64,background:'rgba(5,5,16,0.97)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(167,139,250,0.1)',zIndex:100,alignItems:'center',justifyContent:'space-around',padding:'0 1rem'}}>
          {navItems.map(([id,icon,label]) => (
            <button key={id} onClick={()=>setTab(id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,background:'none',border:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",color:tab===id?'#A78BFA':'#4a4875',flex:1,padding:'8px 0',transition:'color 0.15s'}}>
              <span style={{fontSize:20}}>{icon}</span>
              <span style={{fontSize:10,fontWeight:tab===id?700:400}}>{label}</span>
              {tab===id && <div style={{width:4,height:4,borderRadius:'50%',background:'#A78BFA'}} />}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <main style={{flex:1,overflowY:'auto',position:'relative',zIndex:1}}>
          <div className="main-content" style={{maxWidth:820,padding:'2rem 2rem 2rem',paddingTop:'2rem'}}>

            {/* Mobile top spacer */}
            <div className="mobile-header" style={{display:'none',height:72}} />

            {tab === 'generator' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',animation:'slideUp 0.3s ease'}}>
                {/* Header */}
                <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div>
                    <h1 style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',marginBottom:4}}>
                      AI Content Generator ✦
                    </h1>
                    <p style={{fontSize:13,color:'#6b679a'}}>Describe your business → get professional content instantly</p>
                  </div>
                  <div className="stats-row" style={{display:'flex',gap:8}}>
                    {[['✦',history.length,'Jobs'],['◎',totalWords.toLocaleString(),'Words'],['⏱',`${Math.round(totalWords/40)}m`,'Saved']].map(([icon,val,label])=>(
                      <div key={label} style={{display:'flex',flexDirection:'column',alignItems:'center',background:'rgba(167,139,250,0.06)',border:'1px solid rgba(167,139,250,0.12)',borderRadius:12,padding:'8px 12px',minWidth:60}}>
                        <span style={{fontSize:12,color:'#A78BFA',marginBottom:2}}>{icon}</span>
                        <span style={{fontSize:16,fontWeight:800,color:'#fff',lineHeight:1}}>{val}</span>
                        <span style={{fontSize:9,color:'#6b679a',textTransform:'uppercase',letterSpacing:'0.4px',marginTop:2}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content type */}
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#6b679a',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>Choose content type</div>
                  <div className="type-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {CONTENT_TYPES.map(ct=>(
                      <button key={ct.value} className="type-btn" onClick={()=>setType(ct.value)} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4,padding:'12px',borderRadius:12,border:type===ct.value?'1.5px solid rgba(167,139,250,0.5)':'1.5px solid rgba(255,255,255,0.05)',background:type===ct.value?'rgba(167,139,250,0.1)':'rgba(255,255,255,0.02)',color:type===ct.value?'#fff':'#6b679a',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",textAlign:'left',transition:'all 0.15s',position:'relative'}}>
                        <span style={{fontSize:20}}>{ct.icon}</span>
                        <span style={{fontWeight:600,lineHeight:1.3,fontSize:12}}>{ct.label}</span>
                        {type===ct.value&&<div style={{position:'absolute',top:8,right:8,width:16,height:16,borderRadius:'50%',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>✓</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#6b679a',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>Describe your business</div>
                  <div style={{background:'rgba(255,255,255,0.02)',border:'1.5px solid rgba(255,255,255,0.06)',borderRadius:14,overflow:'hidden',transition:'border-color 0.2s'}}>
                    <textarea onFocus={e=>e.currentTarget.parentElement.style.borderColor='rgba(167,139,250,0.4)'} onBlur={e=>e.currentTarget.parentElement.style.borderColor='rgba(255,255,255,0.06)'} style={{width:'100%',background:'transparent',border:'none',padding:'14px 16px',color:'#fff',fontSize:14,resize:'none',fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,outline:'none',display:'block'}} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={`e.g. "A suya spot in Ikeja targeting office workers. We open from 5pm–11pm and also do delivery on Bolt Food."`} rows={4} />
                    <div style={{display:'flex',justifyContent:'space-between',padding:'8px 16px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      <span style={{fontSize:11,color:'#3a3660'}}>💡 More detail = better content</span>
                      <span style={{fontSize:11,color:'#3a3660'}}>{prompt.length} chars</span>
                    </div>
                  </div>
                </div>

                {/* Generate btn */}
                <button className="gen-btn" onClick={handleGenerate} disabled={generating} style={{padding:'15px',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:14,fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 20px rgba(167,139,250,0.3)',transition:'all 0.2s',opacity:generating?0.7:1}}>
                  {generating ? (
                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                      <span style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}} />
                      Generating your content...
                    </span>
                  ) : '✦  Generate content'}
                </button>

                {error && <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:12,padding:'12px 16px',color:'#fca5a5',fontSize:13,display:'flex',gap:8,lineHeight:1.5}}>⚠️ {error}</div>}

                {/* Output */}
                {output && (
                  <div style={{background:'linear-gradient(135deg,rgba(167,139,250,0.05),rgba(96,165,250,0.03))',border:'1px solid rgba(167,139,250,0.2)',borderRadius:16,overflow:'hidden',animation:'slideUp 0.3s ease'}}>
                    <div className="output-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',borderBottom:'1px solid rgba(167,139,250,0.1)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,padding:'5px 12px',fontSize:12,color:'#A78BFA',fontWeight:700}}>
                        {CONTENT_TYPES.find(t=>t.value===type)?.icon} {CONTENT_TYPES.find(t=>t.value===type)?.label}
                      </div>
                      <button onClick={handleCopy} style={{background:copied?'rgba(74,222,128,0.1)':'rgba(255,255,255,0.05)',border:`1px solid ${copied?'rgba(74,222,128,0.25)':'rgba(255,255,255,0.08)'}`,borderRadius:9,padding:'6px 14px',color:copied?'#86efac':'#aaa',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:'all 0.2s'}}>
                        {copied?'✓ Copied!':'⧉ Copy'}
                      </button>
                    </div>
                    <div style={{padding:'1.25rem 1.5rem'}}>
                      {output.split('\n').map((line,i)=>line?<p key={i} style={{fontSize:14,color:'#d4d0f0',lineHeight:1.85,marginBottom:6}}>{line}</p>:<br key={i}/>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'history' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',animation:'slideUp 0.3s ease'}}>
                <div>
                  <h1 style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',marginBottom:4}}>Generation History ◷</h1>
                  <p style={{fontSize:13,color:'#6b679a'}}>{history.length} generations · {totalWords.toLocaleString()} total words</p>
                </div>
                {history.length===0?(
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'4rem 2rem',textAlign:'center'}}>
                    <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>◎</div>
                    <div style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:8}}>No history yet</div>
                    <div style={{fontSize:14,color:'#6b679a',marginBottom:'1.5rem'}}>Your generated content will appear here</div>
                    <button onClick={()=>setTab('generator')} style={{background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Start generating →</button>
                  </div>
                ):(
                  <div className="history-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
                    {history.map(item=>(
                      <div key={item.id} className="hist-card" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:14,padding:'1.25rem',display:'flex',flexDirection:'column',gap:8,cursor:'default'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontSize:11,color:'#A78BFA',fontWeight:700,background:'rgba(167,139,250,0.1)',padding:'3px 9px',borderRadius:6}}>{CONTENT_TYPES.find(t=>t.value===item.type)?.icon} {CONTENT_TYPES.find(t=>t.value===item.type)?.label}</span>
                          <span style={{fontSize:11,color:'#3a3660'}}>{new Date(item.created_at).toLocaleDateString('en-NG',{day:'numeric',month:'short'})}</span>
                        </div>
                        <div style={{fontSize:12,color:'#8b87b8',fontStyle:'italic',lineHeight:1.5}}>"{item.prompt?.slice(0,80)}{item.prompt?.length>80?'…':''}"</div>
                        <div style={{fontSize:13,color:'#6b679a',lineHeight:1.5}}>{item.output?.slice(0,120)}...</div>
                        <button onClick={()=>{setType(item.type);setPrompt(item.prompt);setOutput(item.output);setTab('generator')}} style={{alignSelf:'flex-start',background:'none',border:'1px solid rgba(167,139,250,0.2)',borderRadius:7,color:'#A78BFA',fontSize:12,padding:'5px 12px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginTop:4}}>Reuse prompt →</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',animation:'slideUp 0.3s ease'}}>
                <div>
                  <h1 style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',marginBottom:4}}>Settings ⚙</h1>
                  <p style={{fontSize:13,color:'#6b679a'}}>Manage your account and subscription</p>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  {[
                    {title:'Account', content:(
                      <div>
                        {[['Email',user?.email],['Plan',isPro?'⚡ Pro':'Free'],['Credits',isPro?'Unlimited':`${credits} remaining`]].map(([l,v])=>(
                          <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                            <span style={{fontSize:14,color:'#6b679a'}}>{l}</span>
                            <span style={{fontSize:14,color:'#fff',fontWeight:600}}>{v}</span>
                          </div>
                        ))}
                        {!isPro&&<button onClick={()=>setShowPaywall(true)} style={{width:'100%',padding:'11px',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",marginTop:14,boxShadow:'0 4px 15px rgba(167,139,250,0.3)'}}>⚡ Upgrade to Pro</button>}
                      </div>
                    )},
                    {title:'Need help?', content:(
                      <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        <p style={{fontSize:13,color:'#6b679a',lineHeight:1.6}}>To change your email, password or cancel your subscription — contact us and we'll sort it within 24 hours.</p>
                        <a href="mailto:naijabuzz2026@gmail.com" style={{display:'block',padding:'11px',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',borderRadius:10,fontSize:13,fontWeight:700,textDecoration:'none',textAlign:'center'}}>✉️ Email support</a>
                        <a href="/support" style={{display:'block',padding:'11px',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.2)',color:'#A78BFA',borderRadius:10,fontSize:13,fontWeight:600,textDecoration:'none',textAlign:'center'}}>❓ FAQs & Help center</a>
                      </div>
                    )},
                    {title:'Legal', content:(
                      <div style={{display:'flex',flexDirection:'column',gap:2}}>
                        {[['About ContentAI','/about'],['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Support & FAQs','/support']].map(([l,h])=>(
                          <a key={h} href={h} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:14,color:'#8b87b8',textDecoration:'none',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                            {l}<span style={{color:'#A78BFA',fontSize:12}}>→</span>
                          </a>
                        ))}
                      </div>
                    )},
                  ].map(({title,content})=>(
                    <div key={title} className="settings-card" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:'1.25rem'}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,0.06)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{title}</div>
                      {content}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile bottom spacer */}
            <div className="mobile-nav" style={{display:'none',height:80}} />
          </div>
        </main>
      </div>

      {showPaywall && <PaywallModal onClose={()=>{setShowPaywall(false);refreshProfile()}} />}
    </>
  )
}
