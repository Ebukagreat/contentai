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
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/dashboard')
      } else {
        const data = await signUp(email, password, fullName)
        // If email confirmation is required, data.session will be null
        if (data.session) {
          navigate('/dashboard')
        } else {
          setSuccess('Account created! Please check your email and click the confirmation link, then come back and sign in.')
          setMode('login')
        }
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}><span style={S.logoIcon}>✦</span><span style={S.logoText}>ContentAI</span></div>
        <h1 style={S.heading}>{mode === 'login' ? 'Welcome back' : 'Start for free'}</h1>
        <p style={S.sub}>{mode === 'login' ? 'Sign in to your account' : 'Create your account — 5 free credits included'}</p>
        {error && <div style={S.err}>{error}</div>}
        {success && <div style={S.successBox}>{success}</div>}
        <form onSubmit={handleSubmit} style={S.form}>
          {mode === 'signup' && (
            <div style={S.field}>
              <label style={S.label}>Full name</label>
              <input style={S.input} type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ada Okonkwo" required />
            </div>
          )}
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} />
          </div>
          <button style={loading ? { ...S.btn, opacity: 0.7 } : S.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {mode === 'login' && (
          <div style={S.tipBox}>
            <div style={S.tipTitle}>⚡ Quick tip</div>
            <div style={S.tipText}>If you just signed up, check your email for a confirmation link first, then sign in here.</div>
          </div>
        )}

        <p style={S.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button style={S.toggleBtn} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const S = {
  page: { minHeight:'100vh',background:'#0A0A0A',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Sans',sans-serif",padding:'1rem' },
  card: { background:'#141414',border:'1px solid #2a2a2a',borderRadius:16,padding:'2.5rem',width:'100%',maxWidth:420 },
  logo: { display:'flex',alignItems:'center',gap:8,marginBottom:'2rem' },
  logoIcon: { fontSize:18,color:'#A78BFA' },
  logoText: { fontSize:16,fontWeight:600,color:'#fff',letterSpacing:'-0.3px' },
  heading: { fontSize:24,fontWeight:600,color:'#fff',marginBottom:6,letterSpacing:'-0.5px' },
  sub: { fontSize:14,color:'#888',marginBottom:'1.5rem',lineHeight:1.5 },
  err: { background:'#2a1515',border:'1px solid #5a2020',borderRadius:8,padding:'10px 14px',color:'#f87171',fontSize:13,marginBottom:'1rem' },
  successBox: { background:'#0f2a1a',border:'1px solid #1a5a30',borderRadius:8,padding:'10px 14px',color:'#4ade80',fontSize:13,marginBottom:'1rem',lineHeight:1.6 },
  form: { display:'flex',flexDirection:'column',gap:16 },
  field: { display:'flex',flexDirection:'column',gap:6 },
  label: { fontSize:13,color:'#aaa',fontWeight:500 },
  input: { background:'#1e1e1e',border:'1px solid #333',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'DM Sans',sans-serif" },
  btn: { background:'#A78BFA',color:'#fff',border:'none',borderRadius:8,padding:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  tipBox: { background:'#1a1a1a',borderRadius:8,padding:'10px 14px',marginTop:'1rem' },
  tipTitle: { fontSize:12,fontWeight:600,color:'#A78BFA',marginBottom:4 },
  tipText: { fontSize:12,color:'#888',lineHeight:1.6 },
  toggle: { fontSize:13,color:'#666',textAlign:'center',marginTop:'1.5rem' },
  toggleBtn: { background:'none',border:'none',color:'#A78BFA',cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500 },
}
