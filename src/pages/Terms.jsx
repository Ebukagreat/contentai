export default function Terms() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#A78BFA'}}>✦</span> ContentAI</div>

        <h1 style={S.title}>Terms of Service</h1>
        <p style={S.meta}>Last updated: May 2026</p>

        <h2 style={S.h2}>1. Acceptance of terms</h2>
        <p style={S.p}>By creating an account and using ContentAI, you agree to these terms. If you do not agree, please do not use the service.</p>

        <h2 style={S.h2}>2. The service</h2>
        <p style={S.p}>ContentAI provides AI-generated content for business use. The free plan includes 5 credits. Paid plans (Starter at ₦2,500/month and Pro at ₦6,500/month) provide additional credits as described at the time of purchase.</p>

        <h2 style={S.h2}>3. Acceptable use</h2>
        <p style={S.p}>You may use ContentAI only for lawful business purposes. You may not use the service to generate spam, misleading content, hate speech, or content that violates Nigerian law.</p>

        <h2 style={S.h2}>4. Payments and refunds</h2>
        <p style={S.p}>Subscriptions are billed monthly. We do not offer refunds for partial months. You can cancel at any time by contacting us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a> and your access will continue until the end of the billing period.</p>

        <h2 style={S.h2}>5. Content ownership</h2>
        <p style={S.p}>You own the content generated using your prompts. ContentAI claims no ownership over the content you create using the service.</p>

        <h2 style={S.h2}>6. Service availability</h2>
        <p style={S.p}>We strive for 99% uptime but cannot guarantee uninterrupted service. We are not liable for losses caused by service downtime.</p>

        <h2 style={S.h2}>7. Account changes</h2>
        <p style={S.p}>To change your email address, password, or cancel your subscription, contact us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a> and we will assist you within 24 hours.</p>

        <h2 style={S.h2}>8. Changes to terms</h2>
        <p style={S.p}>We may update these terms from time to time. Continued use of the service after changes means you accept the new terms.</p>

        <h2 style={S.h2}>9. Contact</h2>
        <p style={S.p}>For any questions about these terms, email <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
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
