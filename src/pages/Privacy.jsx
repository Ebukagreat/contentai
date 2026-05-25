export default function Privacy() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#A78BFA'}}>✦</span> ContentAI</div>

        <h1 style={S.title}>Privacy Policy</h1>
        <p style={S.meta}>Last updated: May 2026</p>

        <h2 style={S.h2}>1. Information we collect</h2>
        <p style={S.p}>We collect your name, email address, and the content prompts you enter when using the app. We do not collect payment card details — all payments are processed securely by Paystack.</p>

        <h2 style={S.h2}>2. How we use your information</h2>
        <p style={S.p}>Your information is used solely to provide the ContentAI service — to create your account, process your subscription, and generate content based on your prompts. We do not sell your data to third parties.</p>

        <h2 style={S.h2}>3. Data storage</h2>
        <p style={S.p}>Your account data and generation history are stored securely on Supabase servers. Your prompts and generated content are stored so you can access your history within the app.</p>

        <h2 style={S.h2}>4. AI processing</h2>
        <p style={S.p}>The text prompts you enter are sent to Groq's AI API to generate content. Please do not enter sensitive personal information in your prompts.</p>

        <h2 style={S.h2}>5. Cookies</h2>
        <p style={S.p}>We use essential cookies only — to keep you logged in to your account. We do not use advertising or tracking cookies.</p>

        <h2 style={S.h2}>6. Your rights</h2>
        <p style={S.p}>You can request deletion of your account and all associated data at any time by emailing <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>

        <h2 style={S.h2}>7. Contact</h2>
        <p style={S.p}>For any privacy concerns, contact us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
      </div>
    </div>
  )
}

const S = {
  page: { minHeight:'100vh', background:'#0A0A0A', fontFamily:"'DM Sans',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#A78BFA', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:600, color:'#fff', marginBottom:'2rem' },
  title: { fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:'4px' },
  meta: { fontSize:12, color:'#555', marginBottom:'2rem', paddingBottom:'2rem', borderBottom:'1px solid #1e1e1e' },
  h2: { fontSize:16, fontWeight:600, color:'#fff', marginBottom:'0.75rem', marginTop:'2rem' },
  p: { fontSize:14, color:'#aaa', lineHeight:1.8, marginBottom:'1rem' },
  link: { color:'#A78BFA', textDecoration:'none' },
}
