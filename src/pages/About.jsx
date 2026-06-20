export default function About() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#FF6B35'}}>●</span> ContentAI</div>
        <h1 style={S.title}>About ContentAI</h1>
        <p style={S.lead}>ContentAI is an AI-powered content generation tool built specifically for Nigerian businesses — helping entrepreneurs create professional content without hiring a copywriter.</p>
        <h2 style={S.h2}>What we do</h2>
        <p style={S.p}>We use AI to generate product descriptions, social media posts, marketing emails, business bios, ad copy, and SEO blog intros — tailored for Nigerian businesses and their audiences.</p>
        <h2 style={S.h2}>Our mission</h2>
        <p style={S.p}>To make professional content creation accessible and affordable for every Nigerian business, from the market trader in Onitsha to the tech startup in Lagos.</p>
        <h2 style={S.h2}>Contact us</h2>
        <p style={S.p}>For support, questions, or feedback, reach us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>.</p>
      </div>
    </div>
  )
}
const S = {
  page: { minHeight:'100vh', background:'#0B1410', fontFamily:"'Inter',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#FF6B35', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:700, color:'#FAF6ED', marginBottom:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  title: { fontSize:28, fontWeight:700, color:'#FAF6ED', letterSpacing:'-0.5px', marginBottom:'1rem', fontFamily:"'Space Grotesk',sans-serif" },
  lead: { fontSize:15, color:'#C5D0C7', lineHeight:1.8, marginBottom:'2rem', borderBottom:'1px solid #24372A', paddingBottom:'2rem' },
  h2: { fontSize:18, fontWeight:700, color:'#FAF6ED', marginBottom:'0.75rem', marginTop:'2rem', fontFamily:"'Space Grotesk',sans-serif" },
  p: { fontSize:14, color:'#C5D0C7', lineHeight:1.8, marginBottom:'1rem' },
  link: { color:'#FF6B35', textDecoration:'none' },
}
