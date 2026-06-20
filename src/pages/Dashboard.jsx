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
    <div style={{minHeight:'100vh',background:'#0B1410',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',sans-serif"}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:36,height:36,borderRadius:9,background:'#FF6B35',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#0B1410',fontFamily:"'Space Grotesk',sans-serif",margin:'0 auto 12px'}}>C</div>
        <div style={{fontSize:13,color:'#9AAB9C'}}>Loading...</div>
      </div>
    </div>
  )

  const navItems = [['generator','Generator'],['history','History'],['settings','Settings']]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0B1410; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-btn:hover { background: #1A2B1F !important; color: #FAF6ED !important; }
        .type-btn:hover { border-color: #FF6B3550 !important; }
        .gen-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .hist-card:hover { border-color: #FF6B3540 !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-nav { display: flex !important; }
          .main-content { padding: 1rem !important; }
          .page-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .type-grid { grid-template-columns: repeat(2,1fr) !important; }
          .history-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      <div style={{minHeight:'100vh',display:'flex',background:'#0B1410',fontFamily:"'Inter',sans-serif",color:'#FAF6ED'}}>

        <aside className="desktop-sidebar" style={{width:240,background:'#0E1B14',borderRight:'1px solid #24372A',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'sticky',top:0,height:'100vh',flexShrink:0}}>
          <div style={{padding:'1.5rem 1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'2.5rem',padding:'0 6px'}}>
              <div style={{width:36,height:36,borderRadius:8,background:'#FF6B35',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#0B1410',fontFamily:"'Space Grotesk',sans-serif",flexShrink:0}}>C</div>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.3px',fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>ContentAI</div>
                <div style={{fontSize:8,color:'#FF6B35',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginTop:2}}>Naija Business</div>
              </div>
            </div>

            <nav style={{display:'flex',flexDirection:'column',gap:3}}>
              {navItems.map(([id,label], i) => (
                <button key={id} className="nav-btn" onClick={() => setTab(id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:6,fontSize:14,color:tab===id?'#FAF6ED':'#9AAB9C',cursor:'pointer',background:tab===id?'#1A2B1F':'none',border:'none',borderLeft:tab===id?'2px solid #FF6B35':'2px solid transparent',fontFamily:"'Inter',sans-serif",textAlign:'left',width:'100%',fontWeight:tab===id?600:400}}>
                  <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:11,fontWeight:700,color:tab===id?'#FF6B35':'#6B8070',width:16}}>{String(i+1).padStart(2,'0')}</span>
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div style={{padding:'1rem',borderTop:'1px solid #24372A'}}>
            <div style={{background:'#16241A',border:'1px solid #2E4A38',borderRadius:6,padding:'1rem',marginBottom:12,borderLeft:'3px solid #FF6B35'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:10,color:'#9AAB9C',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>Credits</span>
                <span style={{fontSize:9,fontWeight:700,background:isPro?'#FF6B35':'#2E4A38',color:isPro?'#0B1410':'#C5D0C7',padding:'2px 8px',borderRadius:3,letterSpacing:'0.5px'}}>{isPro?'PRO':'FREE'}</span>
              </div>
              <div style={{fontSize:24,fontWeight:800,color:'#FAF6ED',marginBottom:10,fontFamily:"'Space Grotesk',sans-serif"}}>{isPro?'∞':credits} <span style={{fontSize:11,fontWeight:400,color:'#9AAB9C',fontFamily:"'Inter',sans-serif"}}>{isPro?'unlimited':'remaining'}</span></div>
              <div style={{height:4,background:'#28402F',borderRadius:2,overflow:'hidden',marginBottom:10}}>
                <div style={{height:'100%',background:isPro?'#FF6B35':credits>2?'#FF6B35':'#E04848',width:isPro?'100%':`${Math.min((credits/5)*100,100)}%`}} />
              </div>
              {!isPro && <button onClick={() => setShowPaywall(true)} style={{width:'100%',padding:'9px',background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:5,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>Upgrade to Pro</button>}
            </div>

            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#FFB627',color:'#0B1410',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}}>{(profile?.full_name||user?.email||'U')[0].toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#FAF6ED',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{profile?.full_name||'User'}</div>
                <div style={{fontSize:11,color:'#6B8070',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email?.slice(0,22)}</div>
              </div>
              <button onClick={async()=>{await signOut();navigate('/auth')}} title="Sign out" style={{background:'none',border:'1px solid #2E4A38',color:'#9AAB9C',cursor:'pointer',fontSize:11,padding:'5px 8px',borderRadius:5,flexShrink:0,fontWeight:600}}>OUT</button>
            </div>
          </div>
        </aside>

        <div className="mobile-header" style={{display:'none',position:'fixed',top:0,left:0,right:0,height:58,background:'#0E1B14',borderBottom:'1px solid #24372A',alignItems:'center',justifyContent:'space-between',padding:'0 1rem',zIndex:100}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,borderRadius:7,background:'#FF6B35',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#0B1410',fontFamily:"'Space Grotesk',sans-serif"}}>C</div>
            <div style={{fontSize:14,fontWeight:700,color:'#FAF6ED',fontFamily:"'Space Grotesk',sans-serif"}}>ContentAI</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {!isPro && <button onClick={()=>setShowPaywall(true)} style={{background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:5,padding:'6px 12px',fontSize:11,fontWeight:700,cursor:'pointer'}}>Pro</button>}
            <div style={{width:28,height:28,borderRadius:'50%',background:'#FFB627',color:'#0B1410',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{(profile?.full_name||user?.email||'U')[0].toUpperCase()}</div>
          </div>
        </div>

        <div className="mobile-nav" style={{display:'none',position:'fixed',bottom:0,left:0,right:0,height:58,background:'#0E1B14',borderTop:'1px solid #24372A',zIndex:100,alignItems:'center',justifyContent:'space-around'}}>
          {navItems.map(([id,label]) => (
            <button key={id} onClick={()=>setTab(id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:tab===id?'#FF6B35':'#6B8070',flex:1,padding:'8px 0'}}>
              <span style={{fontSize:11,fontWeight:tab===id?700:500}}>{label}</span>
              {tab===id && <div style={{width:16,height:2,background:'#FF6B35'}} />}
            </button>
          ))}
        </div>

        <main style={{flex:1,overflowY:'auto'}}>
          <div className="main-content" style={{maxWidth:820,padding:'2rem'}}>
            <div className="mobile-header" style={{display:'none',height:58}} />

            {tab === 'generator' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div>
                    <h1 style={{fontSize:24,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.5px',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>Content generator</h1>
                    <p style={{fontSize:13,color:'#9AAB9C'}}>Tell us your business. We write the words.</p>
                  </div>
                  <div style={{display:'flex',gap:16}}>
                    {[['Jobs',history.length],['Words',totalWords.toLocaleString()],['Saved',`${Math.round(totalWords/40)}m`]].map(([label,val])=>(
                      <div key={label} style={{textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:700,color:'#FAF6ED',fontFamily:"'Space Grotesk',sans-serif"}}>{val}</div>
                        <div style={{fontSize:10,color:'#9AAB9C',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#9AAB9C',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>Content type</div>
                  <div className="type-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {CONTENT_TYPES.map(ct=>(
                      <button key={ct.value} className="type-btn" onClick={()=>setType(ct.value)} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4,padding:'12px',borderRadius:6,border:type===ct.value?'1px solid #FF6B35':'1px solid #24372A',background:type===ct.value?'#1F3326':'#182419',color:type===ct.value?'#FAF6ED':'#A8BFB0',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif",textAlign:'left'}}>
                        <span style={{fontSize:18}}>{ct.icon}</span>
                        <span style={{fontWeight:600,fontSize:12}}>{ct.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#9AAB9C',textTransform:'uppercase',letterSpacing:'1px',marginBottom:10}}>Describe your business</div>
                  <div style={{background:'#142016',border:'1px solid #24372A',borderRadius:6,overflow:'hidden'}}>
                    <textarea style={{width:'100%',background:'transparent',border:'none',padding:'14px 16px',color:'#FAF6ED',fontSize:14,resize:'none',fontFamily:"'Inter',sans-serif",lineHeight:1.7,outline:'none',display:'block'}} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={`e.g. "A suya spot in Ikeja targeting office workers, open 5pm-11pm, also do delivery"`} rows={4} />
                    <div style={{display:'flex',justifyContent:'space-between',padding:'8px 16px',borderTop:'1px solid #24372A'}}>
                      <span style={{fontSize:11,color:'#6B8070'}}>More detail = better content</span>
                      <span style={{fontSize:11,color:'#6B8070'}}>{prompt.length} chars</span>
                    </div>
                  </div>
                </div>

                <button className="gen-btn" onClick={handleGenerate} disabled={generating} style={{padding:'15px',background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:6,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif",opacity:generating?0.7:1}}>
                  {generating ? (
                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                      <span style={{width:14,height:14,border:'2px solid rgba(17,25,15,0.3)',borderTop:'2px solid #0B1410',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}} />
                      Writing your content...
                    </span>
                  ) : 'Generate content'}
                </button>

                {error && <div style={{background:'#2A1410',border:'1px solid #4A2018',borderRadius:6,padding:'12px 16px',color:'#FF9B7A',fontSize:13,lineHeight:1.5}}>{error}</div>}

                {output && (
                  <div style={{background:'#142016',border:'1px solid #2E4A38',borderRadius:8,overflow:'hidden'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 18px',borderBottom:'1px solid #24372A'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#FF6B35',fontWeight:700}}>
                        {CONTENT_TYPES.find(t=>t.value===type)?.icon} {CONTENT_TYPES.find(t=>t.value===type)?.label}
                      </div>
                      <button onClick={handleCopy} style={{background:'#1A2B1F',border:'1px solid #2E4A38',borderRadius:5,padding:'6px 14px',color:copied?'#7ADB8C':'#C5D0C7',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif",fontWeight:600}}>
                        {copied?'Copied':'Copy'}
                      </button>
                    </div>
                    <div style={{padding:'1.25rem 1.5rem'}}>
                      {output.split('\n').map((line,i)=>line?<p key={i} style={{fontSize:14,color:'#E8EDE5',lineHeight:1.85,marginBottom:6}}>{line}</p>:<br key={i}/>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'history' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                <div>
                  <h1 style={{fontSize:24,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.5px',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>History</h1>
                  <p style={{fontSize:13,color:'#9AAB9C'}}>{history.length} generations · {totalWords.toLocaleString()} total words</p>
                </div>
                {history.length===0?(
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'4rem 2rem',textAlign:'center'}}>
                    <div style={{fontSize:14,fontWeight:600,color:'#FAF6ED',marginBottom:8}}>No history yet</div>
                    <div style={{fontSize:13,color:'#9AAB9C',marginBottom:'1.5rem'}}>Your generated content will appear here</div>
                    <button onClick={()=>setTab('generator')} style={{background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:6,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>Start generating</button>
                  </div>
                ):(
                  <div className="history-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
                    {history.map(item=>(
                      <div key={item.id} className="hist-card" style={{background:'#142016',border:'1px solid #24372A',borderRadius:8,padding:'1.25rem',display:'flex',flexDirection:'column',gap:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontSize:11,color:'#FF6B35',fontWeight:700}}>{CONTENT_TYPES.find(t=>t.value===item.type)?.icon} {CONTENT_TYPES.find(t=>t.value===item.type)?.label}</span>
                          <span style={{fontSize:11,color:'#6B8070'}}>{new Date(item.created_at).toLocaleDateString('en-NG',{day:'numeric',month:'short'})}</span>
                        </div>
                        <div style={{fontSize:12,color:'#9AAB9C',fontStyle:'italic',lineHeight:1.5}}>"{item.prompt?.slice(0,80)}{item.prompt?.length>80?'…':''}"</div>
                        <div style={{fontSize:13,color:'#C5D0C7',lineHeight:1.5}}>{item.output?.slice(0,120)}...</div>
                        <button onClick={()=>{setType(item.type);setPrompt(item.prompt);setOutput(item.output);setTab('generator')}} style={{alignSelf:'flex-start',background:'none',border:'1px solid #2E4A38',borderRadius:5,color:'#FF6B35',fontSize:12,padding:'5px 12px',cursor:'pointer',fontFamily:"'Inter',sans-serif",fontWeight:600,marginTop:4}}>Reuse</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                <div>
                  <h1 style={{fontSize:24,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.5px',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>Settings</h1>
                  <p style={{fontSize:13,color:'#9AAB9C'}}>Manage your account and subscription</p>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{background:'#142016',border:'1px solid #24372A',borderRadius:8,padding:'1.25rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#FAF6ED',marginBottom:14,paddingBottom:10,borderBottom:'1px solid #24372A',textTransform:'uppercase',letterSpacing:'0.5px'}}>Account</div>
                    {[['Email',user?.email],['Plan',isPro?'Pro':'Free'],['Credits',isPro?'Unlimited':`${credits} remaining`]].map(([l,v])=>(
                      <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #16241A'}}>
                        <span style={{fontSize:14,color:'#9AAB9C'}}>{l}</span>
                        <span style={{fontSize:14,color:'#FAF6ED',fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                    {!isPro&&<button onClick={()=>setShowPaywall(true)} style={{width:'100%',padding:'11px',background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:6,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Inter',sans-serif",marginTop:14}}>Upgrade to Pro</button>}
                  </div>

                  <div style={{background:'#142016',border:'1px solid #24372A',borderRadius:8,padding:'1.25rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#FAF6ED',marginBottom:14,paddingBottom:10,borderBottom:'1px solid #24372A',textTransform:'uppercase',letterSpacing:'0.5px'}}>Need help?</div>
                    <p style={{fontSize:13,color:'#9AAB9C',lineHeight:1.6,marginBottom:12}}>To change your email, password or cancel — contact us and we will sort it within 24 hours.</p>
                    <a href="mailto:naijabuzz2026@gmail.com" style={{display:'block',padding:'11px',background:'#FF6B35',color:'#0B1410',borderRadius:6,fontSize:13,fontWeight:700,textDecoration:'none',textAlign:'center',marginBottom:8}}>Email support</a>
                    <a href="/support" style={{display:'block',padding:'11px',background:'none',border:'1px solid #2E4A38',color:'#FF6B35',borderRadius:6,fontSize:13,fontWeight:600,textDecoration:'none',textAlign:'center'}}>FAQs & Help</a>
                  </div>

                  <div style={{background:'#142016',border:'1px solid #24372A',borderRadius:8,padding:'1.25rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#FAF6ED',marginBottom:14,paddingBottom:10,borderBottom:'1px solid #24372A',textTransform:'uppercase',letterSpacing:'0.5px'}}>Legal</div>
                    {[['About ContentAI','/about'],['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Support & FAQs','/support']].map(([l,h])=>(
                      <a key={h} href={h} style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'#C5D0C7',textDecoration:'none',padding:'10px 0',borderBottom:'1px solid #16241A'}}>{l}<span style={{color:'#FF6B35'}}>→</span></a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mobile-nav" style={{display:'none',height:70}} />
          </div>
        </main>
      </div>

      {showPaywall && <PaywallModal onClose={()=>{setShowPaywall(false);refreshProfile()}} />}
    </>
  )
}
