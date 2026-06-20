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
        else { setSuccess('Account created. Check your email for a confirmation link, then sign in here.'); setMode('login') }
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0B1410; font-family: 'Inter', sans-serif; }
        .auth-input:focus { border-color: #FF6B35 !important; box-shadow: 0 0 0 3px rgba(255,107,53,0.15) !important; }
        .auth-btn:hover { filter: brightness(1.08); }
        .toggle-link:hover { color: #FFB627 !important; }
        @media (max-width: 768px) {
          .auth-page { flex-direction: column !important; }
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; min-height: 100vh; padding: 2rem 1.25rem !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>

      <div className="auth-page" style={{minHeight:'100vh',display:'flex',background:'#0B1410',fontFamily:"'Inter',sans-serif"}}>

        <div className="auth-left" style={{flex:1, position:'relative', overflow:'hidden', background:'#0B1410', padding:'3rem', display:'flex', flexDirection:'column', justifyContent:'space-between', borderRight:'1px solid #24372A'}}>
          <div style={{position:'absolute', inset:0, opacity:0.5, backgroundImage:`repeating-linear-gradient(135deg, transparent 0px, transparent 38px, #FF6B3522 38px, #FF6B3522 40px, transparent 40px, transparent 78px, #FFB62722 78px, #FFB62722 80px)`, pointerEvents:'none'}} />
          <div style={{ position:'absolute', top:-100, right:-100, width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle, #FF6B3520 0%, transparent 70%)', pointerEvents:'none' }} />

          <div style={{position:'relative', zIndex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'4rem'}}>
              <div style={{width:44,height:44,borderRadius:10,background:'#FF6B35',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#0B1410',fontFamily:"'Space Grotesk',sans-serif"}}>C</div>
              <div>
                <div style={{fontSize:21,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.3px',fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>ContentAI</div>
                <div style={{fontSize:10,color:'#FF6B35',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',marginTop:3}}>Built for Naija business</div>
              </div>
            </div>

            <h1 style={{fontSize:46,fontWeight:800,color:'#FAF6ED',lineHeight:1.08,letterSpacing:'-1.5px',marginBottom:'1.5rem',fontFamily:"'Space Grotesk',sans-serif"}}>
              Your hustle<br/>
              deserves <span style={{color:'#FF6B35'}}>good talk</span>
            </h1>
            <p style={{fontSize:16,color:'#C5D0C7',lineHeight:1.7,marginBottom:'2.5rem',maxWidth:380}}>
              Stop struggling to write captions and product descriptions. ContentAI writes it for you — built for the Nigerian market.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {['Product write-ups that move stock','Social posts people actually share','Emails that get replies, not ignored','Business bios that build trust fast'].map((text, i) => (
                <div key={text} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,color:'#FF6B35',width:22,flexShrink:0}}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{fontSize:14,color:'#E8EDE5',fontWeight:500}}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{position:'relative',zIndex:1,background:'#1A2B1F',border:'1px solid #2D3A24',borderRadius:4,padding:'1.5rem',borderLeft:'3px solid #FF6B35'}}>
            <p style={{fontSize:14,color:'#E8EDE5',lineHeight:1.7,marginBottom:14}}>"I run a small fashion store in Lagos. ContentAI writes my captions in seconds — my engagement went up 3x."</p>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:'#FFB627',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#0B1410'}}>A</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#FAF6ED'}}>Amaka O.</div>
                <div style={{fontSize:11,color:'#9AAB9C'}}>Fashion store owner, Lagos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right" style={{width:480,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'#0B1410'}}>
          <div style={{width:'100%',maxWidth:400}}>

            <div className="mobile-logo" style={{display:'none',alignItems:'center',gap:10,marginBottom:'2rem'}}>
              <div style={{width:38,height:38,borderRadius:9,background:'#FF6B35',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:800,color:'#0B1410',fontFamily:"'Space Grotesk',sans-serif"}}>C</div>
              <div>
                <div style={{fontSize:18,fontWeight:700,color:'#FAF6ED',fontFamily:"'Space Grotesk',sans-serif"}}>ContentAI</div>
                <div style={{fontSize:9,color:'#FF6B35',fontWeight:600,letterSpacing:'1px',textTransform:'uppercase'}}>Built for Naija business</div>
              </div>
            </div>

            <h2 style={{fontSize:27,fontWeight:700,color:'#FAF6ED',letterSpacing:'-0.5px',marginBottom:6,fontFamily:"'Space Grotesk',sans-serif"}}>
              {mode==='login' ? 'Welcome back' : 'Start free, no card'}
            </h2>
            <p style={{fontSize:14,color:'#9AAB9C',marginBottom:'2rem',lineHeight:1.5}}>
              {mode==='login' ? 'Sign in to keep writing' : '5 free credits — try it before you commit'}
            </p>

            {error && <div style={{background:'#2A1410',border:'1px solid #4A2018',borderRadius:6,padding:'12px 16px',color:'#FF9B7A',fontSize:13,marginBottom:'1.25rem'}}>{error}</div>}
            {success && <div style={{background:'#142A18',border:'1px solid #1F4A28',borderRadius:6,padding:'12px 16px',color:'#7ADB8C',fontSize:13,marginBottom:'1.25rem',lineHeight:1.6}}>{success}</div>}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
              {mode==='signup' && (
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <label style={{fontSize:12,color:'#C5D0C7',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Full name</label>
                  <input className="auth-input" style={{background:'#16241A',border:'1px solid #2E4A38',borderRadius:6,padding:'13px 16px',color:'#FAF6ED',fontSize:14,outline:'none',fontFamily:"'Inter',sans-serif",transition:'all 0.2s'}} type="text" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Ada Okonkwo" required />
                </div>
              )}
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:12,color:'#C5D0C7',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Email</label>
                <input className="auth-input" style={{background:'#16241A',border:'1px solid #2E4A38',borderRadius:6,padding:'13px 16px',color:'#FAF6ED',fontSize:14,outline:'none',fontFamily:"'Inter',sans-serif",transition:'all 0.2s'}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                <label style={{fontSize:12,color:'#C5D0C7',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Password</label>
                <div style={{position:'relative'}}>
                  <input className="auth-input" style={{background:'#16241A',border:'1px solid #2E4A38',borderRadius:6,padding:'13px 60px 13px 16px',color:'#FAF6ED',fontSize:14,outline:'none',fontFamily:"'Inter',sans-serif",width:'100%',transition:'all 0.2s'}} type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} />
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:12,color:'#9AAB9C',padding:0,fontFamily:"'Inter',sans-serif",fontWeight:700,letterSpacing:'0.5px'}}>
                    {showPw ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              <button className="auth-btn" style={{background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:6,padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif",marginTop:6,transition:'all 0.15s'}} type="submit" disabled={loading}>
                {loading ? 'Please wait...' : mode==='login' ? 'Sign in' : 'Create free account'}
              </button>
            </form>

            <div style={{display:'flex',alignItems:'center',gap:12,margin:'1.5rem 0'}}>
              <div style={{flex:1,height:1,background:'#28402F'}} />
              <span style={{fontSize:11,color:'#6B8070'}}>OR</span>
              <div style={{flex:1,height:1,background:'#28402F'}} />
            </div>

            <p style={{fontSize:13,color:'#9AAB9C',textAlign:'center',marginBottom:'1rem'}}>
              {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button className="toggle-link" style={{background:'none',border:'none',color:'#FF6B35',cursor:'pointer',fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:700,transition:'color 0.15s'}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setSuccess('')}}>
                {mode==='login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
            <p style={{fontSize:11,color:'#6B8070',textAlign:'center'}}>By continuing you agree to our <a href="/terms" style={{color:'#9AAB9C',textDecoration:'none'}}>Terms</a> & <a href="/privacy" style={{color:'#9AAB9C',textDecoration:'none'}}>Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </>
  )
}
