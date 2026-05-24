import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const required = [
  ['VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL],
  ['VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY],
  ['VITE_GROQ_API_KEY', import.meta.env.VITE_GROQ_API_KEY],
  ['VITE_PAYSTACK_PUBLIC_KEY', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY],
]

const missing = required.filter(([, val]) => !val || val.includes('your-') || val === 'undefined')

if (missing.length > 0) {
  document.getElementById('root').innerHTML = `
    <div style="min-height:100vh;background:#0A0A0A;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;padding:2rem;">
      <div style="background:#141414;border:1px solid #2a2a2a;border-radius:16px;padding:2.5rem;max-width:520px;width:100%;">
        <div style="font-size:32px;margin-bottom:1rem;">⚙️</div>
        <h1 style="color:#fff;font-size:20px;font-weight:600;margin-bottom:8px;">Almost there! Setup needed</h1>
        <p style="color:#888;font-size:14px;line-height:1.6;margin-bottom:1.5rem;">Your <code style="background:#222;padding:2px 6px;border-radius:4px;color:#A78BFA">.env</code> file is missing or incomplete.</p>
        <div style="background:#1a1a1a;border-radius:10px;padding:1rem;margin-bottom:1.5rem;">
          <div style="font-size:12px;color:#A78BFA;font-weight:600;margin-bottom:8px;text-transform:uppercase;">Missing keys:</div>
          ${missing.map(([name]) => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #222;"><span style="color:#f87171;">✕</span><code style="color:#fff;font-size:13px;">${name}</code></div>`).join('')}
        </div>
        <div style="font-size:13px;color:#aaa;line-height:1.8;">
          <div style="font-weight:600;color:#fff;margin-bottom:8px;">Where to get each key:</div>
          <div>🟣 <strong style="color:#ccc;">Supabase</strong> → supabase.com → Settings → API</div>
          <div>🟠 <strong style="color:#ccc;">Groq</strong> → console.groq.com → API Keys (free, no card)</div>
          <div>🟡 <strong style="color:#ccc;">Paystack</strong> → dashboard.paystack.com → Settings → API Keys</div>
        </div>
      </div>
    </div>`
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><App /></React.StrictMode>
  )
}
