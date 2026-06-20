export default function Privacy() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#FF6B35'}}>●</span> ContentAI</div>
        <h1 style={S.title}>Privacy Policy</h1>
        <p style={S.meta}>Last updated: June 2026</p>
        <h2 style={S.h2}>1. Information we collect</h2>
        <p style={S.p}>We collect your name, email address, and the content prompts you enter. We do not collect payment card details — all payments are processed securely by Paystack.</p>
        <h2 style={S.h2}>2. How we use your information</h2>
        <p style={S.p}>Your information is used solely to provide the ContentAI service. We do not sell your data to third parties.</p>
        <h2 style={S.h2}>3. Data storage</h2>
        <p style={S.p}>Your account data and generation history are stored securely on Supabase servers.</p>
        <h2 style={S.h2}>4. AI processing</h2>
        <p style={S.p}>Your prompts are sent to Groq's AI API to generate content. Please avoid entering sensitive personal information in your prompts.</p>
        <h2 style={S.h2}>5. Your rights</h2>
        <p style={S.p}>You can request deletion of your account and data at any time by emailing <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
        <h2 style={S.h2}>6. Contact</h2>
        <p style={S.p}>For privacy concerns, contact us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
      </div>
    </div>
  )
}
const S = {
  page: { minHeight:'100vh', background:'#11190F', fontFamily:"'Inter',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#FF6B35', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:700, color:'#F4EBD9', marginBottom:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  title: { fontSize:28, fontWeight:700, color:'#F4EBD9', letterSpacing:'-0.5px', marginBottom:'4px', fontFamily:"'Space Grotesk',sans-serif" },
  meta: { fontSize:12, color:'#4A5240', marginBottom:'2rem', paddingBottom:'2rem', borderBottom:'1px solid #1F2B1A' },
  h2: { fontSize:16, fontWeight:700, color:'#F4EBD9', marginBottom:'0.75rem', marginTop:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  p: { fontSize:14, color:'#A8AC9E', lineHeight:1.8, marginBottom:'1rem' },
  link: { color:'#FF6B35', textDecoration:'none' },
}
