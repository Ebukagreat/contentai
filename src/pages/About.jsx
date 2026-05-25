export default function About() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <a href="/dashboard" style={S.back}>← Back to app</a>
        <div style={S.logo}><span style={{color:'#A78BFA'}}>✦</span> ContentAI</div>

        <h1 style={S.title}>About ContentAI</h1>
        <p style={S.lead}>ContentAI is an AI-powered content generation tool built specifically for Nigerian businesses. We help entrepreneurs, small business owners, and marketers create professional content in seconds — without hiring a copywriter.</p>

        <h2 style={S.h2}>What we do</h2>
        <p style={S.p}>We use advanced AI to generate product descriptions, social media posts, marketing emails, business bios, ad copy, and SEO blog intros — all tailored for Nigerian businesses and their audiences.</p>

        <h2 style={S.h2}>Our mission</h2>
        <p style={S.p}>To make professional content creation accessible and affordable for every Nigerian business, from the market trader in Onitsha to the tech startup in Lagos.</p>

        <h2 style={S.h2}>Contact us</h2>
        <p style={S.p}>For support, questions, or feedback, reach us at <a href="mailto:naijabuzz2026@gmail.com" style={S.link}>naijabuzz2026@gmail.com</a>. We typically respond within 24 hours.</p>
      </div>
    </div>
  )
}

const S = {
  page: { minHeight:'100vh', background:'#0A0A0A', fontFamily:"'DM Sans',sans-serif", padding:'2rem 1rem' },
  container: { maxWidth:680, margin:'0 auto' },
  back: { color:'#A78BFA', fontSize:13, textDecoration:'none', display:'inline-block', marginBottom:'1.5rem' },
  logo: { fontSize:18, fontWeight:600, color:'#fff', marginBottom:'2rem' },
  title: { fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:'1rem' },
  lead: { fontSize:15, color:'#aaa', lineHeight:1.8, marginBottom:'2rem', borderBottom:'1px solid #1e1e1e', paddingBottom:'2rem' },
  h2: { fontSize:18, fontWeight:600, color:'#fff', marginBottom:'0.75rem', marginTop:'2rem' },
  p: { fontSize:14, color:'#aaa', lineHeight:1.8, marginBottom:'1rem' },
  link: { color:'#A78BFA', textDecoration:'none' },
}
