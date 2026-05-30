import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password); navigate('/dashboard')
      } else {
        const data = await signUp(email, password, fullName)
        if (data.session) { navigate('/dashboard') }
        else { setSuccess('Account created! Check your email for a confirmation link, then sign in here.'); setMode('login') }
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050510; font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes glow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .auth-input:focus { border-color: #A78BFA !important; box-shadow: 0 0 0 3px rgba(167,139,250,0.15) !important; }
        .auth-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(167,139,250,0.4) !important; }
        .toggle-link:hover { color: #c4b5fd !important; }

        @media (max-width: 768px) {
          .auth-page { flex-direction: column !important; }
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; min-height: 100vh; padding: 2rem 1.25rem !important; justify-content: center; }
          .auth-card { max-width: 100% !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>

      <div className="auth-page" style={{minHeight:'100vh',display:'flex',fontFamily:"'DM Sans',sans-serif",background:'#050510'}}>

        {/* Left panel - hidden on mobile */}
        <div className="auth-left" style={{flex:1,background:'linear-gradient(135deg,#0d0b1e 0%,#110e2a 50%,#0d1a2e 100%)',padding:'3rem',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden',borderRight:'1px solid rgba(167,139,250,0.1)'}}>
          {/* Glowing orbs */}
          <div style={{position:'absolute',top:'10%',left:'20%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 70%)',animation:'glow 3s ease-in-out infinite',pointerEvents:'none'}} />
          <div style={{position:'absolute',bottom:'20%',right:'10%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',animation:'glow 4s ease-in-out infinite 1s',pointerEvents:'none'}} />

          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'3.5rem'}}>
              <div style={{width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:900,boxShadow:'0 0 20px rgba(167,139,250,0.5)'}}>✦</div>
              <div>
                <div style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',lineHeight:1}}>ContentAI</div>
                <div style={{fontSize:10,color:'#A78BFA',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase'}}>For Nigerian Business</div>
              </div>
            </div>

            <h1 style={{fontSize:48,fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'-2px',marginBottom:'1.5rem'}}>
              Write content<br/>
              <span style={{background:'linear-gradient(135deg,#A78BFA,#60A5FA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>10x faster</span>
            </h1>
            <p style={{fontSize:16,color:'#8b87b8',lineHeight:1.8,marginBottom:'2.5rem',maxWidth:380}}>AI-powered content for Nigerian entrepreneurs. Stop spending hours writing — let AI do it in seconds.</p>

            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[
                ['📦','Product descriptions that sell'],
                ['📱','Social posts that get engagement'],
                ['✉️','Emails that convert readers to buyers'],
                ['📣','Ad copy that drives clicks'],
                ['👤','Professional bios that build trust'],
              ].map(([icon,text]) => (
                <div key={text} style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{icon}</div>
                  <span style={{fontSize:14,color:'#c4c0e8',fontWeight:500}}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{position:'relative',zIndex:1,background:'rgba(167,139,250,0.06)',border:'1px solid rgba(167,139,250,0.15)',borderRadius:16,padding:'1.5rem'}}>
            <div style={{display:'flex',gap:3,marginBottom:10}}>
              {[1,2,3,4,5].map(i => <span key={i} style={{color:'#F59E0B',fontSize:14}}>★</span>)}
            </div>
            <p style={{fontSize:14,color:'#c4c0e8',lineHeight:1.7,marginBottom:12,fontStyle:'italic'}}>"I run a small fashion store in Lagos. ContentAI writes my Instagram captions and product descriptions in seconds. My engagement went up 3x!"</p>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>A</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Amaka O.</div>
                <div style={{fontSize:11,color:'#6b679a'}}>Fashion store owner, Lagos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right" style={{width:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'#050510'}}>
          <div className="auth-card" style={{width:'100%',maxWidth:420,animation:'slideUp 0.4s ease'}}>

            {/* Mobile logo only */}
            <div className="mobile-logo" style={{display:'none',alignItems:'center',gap:10,marginBottom:'2rem'}}>
              <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#A78BFA,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,boxShadow:'0 0 16px rgba(167,139,250,0.4)'}}>✦</div>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:'-0.5px'}}>ContentAI</div>
                <div style={{fontSize:9,color:'#A78BFA',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase'}}>For Nigerian Business</div>
              </div>
            </div>

            <h2 style={{fontSize:28,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',marginBottom:6}}>{mode==='login'?'Welcome back 👋':'Get started free 🚀'}</h2>
            <p style={{fontSize:14,color:'#6b679a',marginBottom:'2rem',lineHeight:1.5}}>{mode==='login'?'Sign in to your ContentAI account':'5 free credits — no card needed ever'}</p>

            {error && <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:12,padding:'12px 16px',color:'#fca5a5',fontSize:13,marginBottom:'1.25rem',display:'flex',gap:8,lineHeight:1.5}}>⚠️ {error}</div>}
            {success && <div style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:12,padding:'12px 16px',color:'#86efac',fontSize:13,marginBottom:'1.25rem',lineHeight:1.6}}>✅ {success}</div>}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
              {mode==='signup' && (
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <label style={{fontSize:13,color:'#8b87b8',fontWeight:600}}>Full name</label>
                  <input className="auth-input" style={{background:'#0c0b1e',border:'1px solid #2a2748',borderRadius:12,padding:'13px 16px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'DM Sans',sans-serif",transition:'all 0.2s'}} type="text" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Ada Okonkwo" required />
                </div>
              )}
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:13,color:'#8b87b8',fontWeight:600}}>Email address</label>
                <input className="auth-input" style={{background:'#0c0b1e',border:'1px solid #2a2748',borderRadius:12,padding:'13px 16px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'DM Sans',sans-serif",transition:'all 0.2s'}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:13,color:'#8b87b8',fontWeight:600}}>Password</label>
                <div style={{position:'relative'}}>
                  <input className="auth-input" style={{background:'#0c0b1e',border:'1px solid #2a2748',borderRadius:12,padding:'13px 48px 13px 16px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'DM Sans',sans-serif",transition:'all 0.2s',width:'100%'}} type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} />
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#6b679a',padding:0,lineHeight:1}}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button className="auth-btn" style={{background:'linear-gradient(135deg,#A78BFA,#7C3AED)',color:'#fff',border:'none',borderRadius:12,padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",marginTop:4,transition:'all 0.2s',boxShadow:'0 4px 20px rgba(167,139,250,0.3)'}} type="submit" disabled={loading}>
                {loading ? '⏳ Please wait...' : mode==='login' ? 'Sign in →' : 'Create free account →'}
              </button>
            </form>

            <div style={{display:'flex',alignItems:'center',gap:12,margin:'1.5rem 0'}}>
              <div style={{flex:1,height:1,background:'#1a1830'}} />
              <span style={{fontSize:12,color:'#3a3660',background:'#050510',padding:'0 8px'}}>or</span>
              <div style={{flex:1,height:1,background:'#1a1830'}} />
            </div>

            <p style={{fontSize:13,color:'#6b679a',textAlign:'center',marginBottom:'1rem'}}>
              {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button className="toggle-link" style={{background:'none',border:'none',color:'#A78BFA',cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:700,transition:'color 0.15s'}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setSuccess('')}}>
                {mode==='login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
            <p style={{fontSize:11,color:'#3a3660',textAlign:'center'}}>By continuing you agree to our <a href="/terms" style={{color:'#6b679a',textDecoration:'none'}}>Terms</a> & <a href="/privacy" style={{color:'#6b679a',textDecoration:'none'}}>Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </>
  )
}
