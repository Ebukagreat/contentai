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
    } catch (err) {
      alert(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <button style={S.closeBtn} onClick={onClose}>✕</button>
        <span style={S.badge}>Upgrade</span>
        <h2 style={S.title}>You've used all your free credits</h2>
        <p style={S.sub}>Choose a plan to keep generating AI content</p>

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
        <p style={S.secure}>🔒 Secured by Paystack · Cancel anytime</p>
      </div>
    </div>
  )
}

const S = {
  overlay: { position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem' },
  modal: { background:'#141414',border:'1px solid #2a2a2a',borderRadius:20,padding:'2rem',maxWidth:500,width:'100%',position:'relative',fontFamily:"'DM Sans',sans-serif" },
  closeBtn: { position:'absolute',top:16,right:16,background:'#222',border:'none',color:'#888',borderRadius:'50%',width:28,height:28,cursor:'pointer',fontSize:12 },
  badge: { background:'#1e1433',color:'#A78BFA',fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:99,display:'inline-block',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px' },
  title: { fontSize:20,fontWeight:600,color:'#fff',letterSpacing:'-0.4px',marginBottom:6 },
  sub: { fontSize:13,color:'#888',lineHeight:1.5,marginBottom:'1.5rem' },
  grid: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.25rem' },
  planCard: { border:'1.5px solid #2a2a2a',borderRadius:12,padding:'1rem',cursor:'pointer',position:'relative' },
  planSel: { border:'1.5px solid #A78BFA',background:'#0e0b1a' },
  popBadge: { position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'#A78BFA',color:'#fff',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99,whiteSpace:'nowrap' },
  planName: { fontSize:14,fontWeight:600,color:'#fff',marginBottom:4 },
  planPrice: { fontSize:20,fontWeight:700,color:'#A78BFA',marginBottom:10 },
  list: { listStyle:'none',padding:0,margin:0 },
  li: { fontSize:12,color:'#aaa',marginBottom:4,display:'flex',gap:6,alignItems:'flex-start' },
  check: { color:'#A78BFA',flexShrink:0 },
  payBtn: { width:'100%',padding:13,background:'#A78BFA',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  secure: { textAlign:'center',fontSize:12,color:'#555',marginTop:10 },
}
