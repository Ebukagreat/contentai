export default function Terms() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#FF6B35'}}>●</span> ContentAI</div>
        <h1 style={S.title}>Terms of Service</h1>
        <p style={S.meta}>Last updated: June 2026</p>
        <h2 style={S.h2}>1. Acceptance of terms</h2>
        <p style={S.p}>By creating an account and using ContentAI, you agree to these terms.</p>
        <h2 style={S.h2}>2. The service</h2>
        <p style={S.p}>ContentAI provides AI-generated content for business use. Free plan includes 5 credits. Paid plans: Starter (₦2,500/mo) and Pro (₦6,500/mo).</p>
        <h2 style={S.h2}>3. Acceptable use</h2>
        <p style={S.p}>You may use ContentAI only for lawful business purposes. You may not generate spam, misleading content, hate speech, or content violating Nigerian law.</p>
        <h2 style={S.h2}>4. Payments and refunds</h2>
        <p style={S.p}>Subscriptions are billed monthly. We do not offer refunds for partial months. Cancel anytime by emailing <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
        <h2 style={S.h2}>5. Content ownership</h2>
        <p style={S.p}>You own the content generated using your prompts.</p>
        <h2 style={S.h2}>6. Account changes</h2>
        <p style={S.p}>To change your email, password, or cancel — contact <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
        <h2 style={S.h2}>7. Contact</h2>
        <p style={S.p}>Questions about these terms: <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
      </div>
    </div>
  )
}
const S = {
  page: { minHeight:'100vh', background:'#0B1410', fontFamily:"'Inter',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#FF6B35', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:700, color:'#FAF6ED', marginBottom:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  title: { fontSize:28, fontWeight:700, color:'#FAF6ED', letterSpacing:'-0.5px', marginBottom:'4px', fontFamily:"'Space Grotesk',sans-serif" },
  meta: { fontSize:12, color:'#6B8070', marginBottom:'2rem', paddingBottom:'2rem', borderBottom:'1px solid #24372A' },
  h2: { fontSize:16, fontWeight:700, color:'#FAF6ED', marginBottom:'0.75rem', marginTop:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  p: { fontSize:14, color:'#C5D0C7', lineHeight:1.8, marginBottom:'1rem' },
  link: { color:'#FF6B35', textDecoration:'none' },
}
