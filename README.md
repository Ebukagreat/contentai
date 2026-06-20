# ContentAI — AI SaaS for Nigerian Businesses
### Powered by Google Gemini (FREE) + Supabase (FREE) + Paystack (FREE)

---

## What you need (all free, no credit card)

1. **Supabase** — stores users and their data → https://supabase.com
2. **Google Gemini API** — the AI that generates content → https://aistudio.google.com
3. **Paystack** — collects ₦ payments from your customers → https://paystack.com
4. **Vercel** — hosts your website free → https://vercel.com
5. **GitHub** — stores your code free → https://github.com

---

## Step 1 — Get your Gemini API key (5 minutes, NO card needed)

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with any Google account
3. Click **"Create API Key"**
4. Copy the key — it looks like `AIzaSy...`

That's it. Free. No payment needed.

---

## Step 2 — Get your Supabase keys (10 minutes)

1. Go to **https://supabase.com** → Sign up free
2. Click **"New project"** → give it a name → set a database password → click Create
3. Wait ~2 minutes for it to set up
4. Go to **Settings → API** in the left sidebar
5. Copy your **Project URL** (looks like `https://xxxx.supabase.co`)
6. Copy your **anon public key** (long string starting with `eyJ...`)

**Set up your database:**
1. In your Supabase project, click **SQL Editor** in the left menu
2. Click **"New query"**
3. Open the file `supabase_schema.sql` from this folder
4. Copy everything inside it → paste into the SQL editor → click **Run**
5. You should see "Success. No rows returned"

---

## Step 3 — Get your Paystack keys (10 minutes)

1. Go to **https://paystack.com** → Create a free business account
2. After signing up, go to **Settings → API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_` for testing, `pk_live_` when live)

> You can start with the test key and receive real money once you switch to live and verify your business.

---

## Step 4 — Configure your app

1. In the project folder, find the file called `.env.example`
2. Make a copy of it and rename the copy to `.env`
3. Open `.env` and fill in your 4 keys:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
```

---

## Step 5 — Run on your computer (to test)

You need Node.js installed → download free at https://nodejs.org (click "LTS" version)

Then open a terminal/command prompt in the project folder and run:

```bash
npm install
npm run dev
```

Open your browser at **http://localhost:5173** — your app is running!

Create a test account, try generating content, confirm everything works.

---

## Step 6 — Put it live on the internet (free)

1. Create a free GitHub account at https://github.com
2. Create a new repository (click the + button → New repository)
3. Upload your project files to the repository

4. Go to **https://vercel.com** → Sign up free with your GitHub account
5. Click **"Add New Project"** → Select your GitHub repository → Click Import
6. In the **"Environment Variables"** section, add your 4 keys (same as your `.env` file)
7. Click **Deploy**

Your app will be live at a link like `contentai.vercel.app` in about 2 minutes!

---

## How you make money

| Plan | Price | Your cut (after Paystack 1.5%) |
|------|-------|-------------------------------|
| Starter | ₦2,500/month | ₦2,462 per subscriber |
| Pro | ₦6,500/month | ₦6,402 per subscriber |

**Examples:**
- 20 subscribers on Starter = ₦49,240/month
- 50 subscribers on Pro = ₦320,100/month

Your only ongoing cost is Paystack's 1.5% fee — everything else is free.

---

## How to get your first customers

1. **WhatsApp groups** — Share in business, entrepreneurship, and SME WhatsApp groups
2. **Twitter/X** — Post a demo video showing the app generating content
3. **Facebook groups** — Nigerian business groups, market groups, entrepreneur groups
4. **Offer free trials** — Let people use it free for a week, then ask them to subscribe
5. **Target small businesses** — Hair salons, restaurants, online stores, service providers

---

## Files in this project

```
contentai/
├── index.html              ← App entry point
├── .env.example            ← Copy this to .env and add your keys
├── supabase_schema.sql     ← Run this in Supabase SQL Editor
├── src/
│   ├── lib/
│   │   ├── ai.js           ← Google Gemini AI (FREE)
│   │   ├── supabase.js     ← Database & auth
│   │   └── paystack.js     ← ₦ Payments
│   ├── components/
│   │   ├── AuthContext.jsx ← Login state
│   │   └── PaywallModal.jsx← Upgrade popup
│   └── pages/
│       ├── AuthPage.jsx    ← Login & signup
│       └── Dashboard.jsx   ← Main app
```
