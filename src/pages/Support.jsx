import { useState } from 'react'

export default function Support() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'How do I change my email address?', a: 'Email naijabuzz2026@gmail.com with your current and new email. We will update it within 24 hours.' },
    { q: 'How do I change my password?', a: 'Email naijabuzz2026@gmail.com from your registered email and request a password reset.' },
    { q: 'How do I cancel my subscription?', a: 'Email naijabuzz2026@gmail.com to cancel. You keep access until the end of your billing period.' },
    { q: 'My credits are not showing correctly', a: 'Try signing out and back in. If it persists, email naijabuzz2026@gmail.com with your account email.' },
    { q: 'The AI content is not generating', a: 'Check your internet connection and retry. If the issue continues, email naijabuzz2026@gmail.com.' },
    { q: 'Can I get a refund?', a: 'We do not offer refunds for partial months, but genuine complaints can be sent to naijabuzz2026@gmail.com.' },
    { q: 'Is my business data safe?', a: 'Yes. Your data is stored securely and never sold. See our Privacy Policy for details.' },
  ]
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#FF6B35'}}>●</span> ContentAI</div>
        <h1 style={S.title}>Support</h1>
        <p style={S.lead}>Need help? Check the FAQs below or contact us directly.</p>
        <div style={S.contactCard}>
          <div style={S.contactTitle}>Email support</div>
          <div style={S.contactSub}>We respond within 24 hours</div>
          <a href="mailto:naijabuzz2026@gmail.com" style={S.contactEmail}>naijabuzz2026@gmail.com</a>
        </div>
        <h2 style={S.h2}>Frequently asked questions</h2>
        <div style={S.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} style={S.faqItem} onClick={() => setOpen(open === i ? null : i)}>
              <div style={S.faqQ}><span>{faq.q}</span><span style={{color:'#FF6B35',fontSize:18}}>{open === i ? '−' : '+'}</span></div>
              {open === i && <div style={S.faqA}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <div style={S.footer}>
          <a href="/about" style={S.footLink}>About</a>
          <a href="/privacy" style={S.footLink}>Privacy Policy</a>
          <a href="/terms" style={S.footLink}>Terms of Service</a>
        </div>
      </div>
    </div>
  )
}
const S = {
  page: { minHeight:'100vh', background:'#11190F', fontFamily:"'Inter',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#FF6B35', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:700, color:'#F4EBD9', marginBottom:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  title: { fontSize:28, fontWeight:700, color:'#F4EBD9', letterSpacing:'-0.5px', marginBottom:'0.5rem', fontFamily:"'Space Grotesk',sans-serif" },
  lead: { fontSize:14, color:'#A8AC9E', lineHeight:1.8, marginBottom:'2rem' },
  contactCard: { background:'#141C0F', border:'1px solid #1F2B1A', borderRadius:8, padding:'1.25rem', marginBottom:'2.5rem', borderLeft:'3px solid #FF6B35' },
  contactTitle: { fontSize:15, fontWeight:700, color:'#F4EBD9', marginBottom:2, fontFamily:"'Space Grotesk',sans-serif" },
  contactSub: { fontSize:12, color:'#7C8170', marginBottom:6 },
  contactEmail: { color:'#FF6B35', fontSize:14, textDecoration:'none', fontWeight:600 },
  h2: { fontSize:18, fontWeight:700, color:'#F4EBD9', marginBottom:'1rem', fontFamily:"'Space Grotesk',sans-serif" },
  faqList: { display:'flex', flexDirection:'column', gap:8 },
  faqItem: { background:'#141C0F', border:'1px solid #1F2B1A', borderRadius:6, padding:'14px 16px', cursor:'pointer' },
  faqQ: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, fontSize:14, color:'#F4EBD9', fontWeight:500 },
  faqA: { fontSize:13, color:'#A8AC9E', lineHeight:1.7, marginTop:10, paddingTop:10, borderTop:'1px solid #1F2B1A' },
  footer: { display:'flex', gap:20, marginTop:'3rem', paddingTop:'1.5rem', borderTop:'1px solid #1F2B1A' },
  footLink: { fontSize:13, color:'#4A5240', textDecoration:'none' },
}
