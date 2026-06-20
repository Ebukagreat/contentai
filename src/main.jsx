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
    <div style="min-height:100vh;background:#11190F;display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:2rem;">
      <div style="background:#141C0F;border:1px solid #2A3621;border-radius:8px;padding:2rem;max-width:500px;">
        <h1 style="color:#F4EBD9;font-size:18px;margin-bottom:8px;">Setup needed</h1>
        <p style="color:#7C8170;font-size:13px;margin-bottom:1rem;">Missing: ${missing.map(m=>m[0]).join(', ')}</p>
      </div>
    </div>`
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><App /></React.StrictMode>
  )
}
