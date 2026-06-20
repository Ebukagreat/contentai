import { useState } from 'react'
import { PLANS, openPaystackPayment } from '../lib/paystack'
import { upgradePlan } from '../lib/supabase'
import { useAuth } from './AuthContext'

export default function PaywallModal({ onClose }) {
  const { user, refreshProfile } = useAuth()
  const [selected, setSelected] = useState('pro')
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      openPaystackPayment({
        email: user.email,
        plan: selected,
        onSuccess: async (_ref, plan) => {
          await upgradePlan(user.id, plan)
          refreshProfile()
          onClose()
        },
        onClose: () => setLoading(false),
      })
    } catch (err) { alert(err.message); setLoading(false) }
  }

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <button style={S.closeBtn} onClick={onClose}>✕</button>
        <span style={S.badge}>Upgrade</span>
        <h2 style={S.title}>You've used all your free credits</h2>
        <p style={S.sub}>Choose a plan to keep generating content</p>

        <div style={S.grid}>
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} style={selected === key ? { ...S.planCard, ...S.planSel } : S.planCard} onClick={() => setSelected(key)}>
              {key === 'pro' && <div style={S.popBadge}>Most popular</div>}
              <div style={S.planName}>{plan.name}</div>
              <div style={S.planPrice}>{plan.priceLabel}</div>
              <ul style={S.list}>
                {plan.features.map(f => <li key={f} style={S.li}><span style={S.check}>✓</span>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <button style={loading ? { ...S.payBtn, opacity: 0.7 } : S.payBtn} onClick={handlePay} disabled={loading}>
          {loading ? 'Opening Paystack...' : `Pay ${PLANS[selected].priceLabel} with Paystack`}
        </button>
        <p style={S.secure}>Secured by Paystack · Cancel anytime</p>
      </div>
    </div>
  )
}

const S = {
  overlay: { position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem' },
  modal: { background:'#142016',border:'1px solid #2E4A38',borderRadius:12,padding:'2rem',maxWidth:480,width:'100%',position:'relative',fontFamily:"'Inter',sans-serif" },
  closeBtn: { position:'absolute',top:16,right:16,background:'#24372A',border:'none',color:'#9AAB9C',borderRadius:5,width:26,height:26,cursor:'pointer',fontSize:12 },
  badge: { background:'#2A1F10',color:'#FF6B35',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:4,display:'inline-block',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px' },
  title: { fontSize:19,fontWeight:700,color:'#FAF6ED',marginBottom:6,fontFamily:"'Space Grotesk',sans-serif" },
  sub: { fontSize:13,color:'#9AAB9C',marginBottom:'1.5rem' },
  grid: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.25rem' },
  planCard: { border:'1px solid #24372A',borderRadius:8,padding:'1rem',cursor:'pointer',position:'relative',background:'#0E1B14' },
  planSel: { border:'1px solid #FF6B35',background:'#1A2B1F' },
  popBadge: { position:'absolute',top:-9,left:'50%',transform:'translateX(-50%)',background:'#FF6B35',color:'#0B1410',fontSize:10,fontWeight:700,padding:'2px 10px',borderRadius:99,whiteSpace:'nowrap' },
  planName: { fontSize:14,fontWeight:700,color:'#FAF6ED',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif" },
  planPrice: { fontSize:19,fontWeight:800,color:'#FF6B35',marginBottom:10,fontFamily:"'Space Grotesk',sans-serif" },
  list: { listStyle:'none',padding:0,margin:0 },
  li: { fontSize:12,color:'#C5D0C7',marginBottom:4,display:'flex',gap:6,alignItems:'flex-start' },
  check: { color:'#FF6B35',flexShrink:0 },
  payBtn: { width:'100%',padding:13,background:'#FF6B35',color:'#0B1410',border:'none',borderRadius:6,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Inter',sans-serif" },
  secure: { textAlign:'center',fontSize:12,color:'#6B8070',marginTop:10 },
}
