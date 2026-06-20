const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPTS = {
  product: `You are a world-class copywriter for Nigerian businesses. Write a compelling product description that highlights benefits, creates desire, and converts browsers into buyers. Use warm, professional English that resonates with Nigerian consumers. Write 2–3 short paragraphs. Be specific and persuasive.`,
  social: `You are a social media expert for Nigerian businesses. Write an engaging post that captures attention in crowded feeds. Be punchy, relatable, and culturally resonant with Nigerian audiences. Include 3–5 relevant hashtags at the end. Suitable for Instagram and Facebook.`,
  email: `You are an email marketing specialist for Nigerian businesses. Write a conversion-focused marketing email with: a subject line (labeled "Subject:"), a warm greeting, 2 body paragraphs, a clear call-to-action, and a professional sign-off. Keep it concise and compelling.`,
  bio: `You are a brand strategist for Nigerian businesses. Write a professional, confident business bio that builds trust and authority. 2 paragraphs — first about what they do and who they serve, second about their unique value and credibility. Warm and professional tone.`,
  ad: `You are a performance ad copywriter for Nigerian businesses. Write high-converting ad copy with: a bold headline, 2 lines of benefit-focused body copy, and a clear call-to-action. Perfect for Facebook and Instagram ads. Keep it short and punchy.`,
  seo: `You are an SEO content strategist for Nigerian businesses. Write an SEO-optimized blog intro of 3 paragraphs that naturally includes the keyword, hooks the reader immediately, and signals expertise. Add a meta description at the end labeled "Meta description:".`,
}

export async function generateContent(type, prompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const systemPrompt = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.product

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.8,
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Generation failed. Check your Groq API key.')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export const CONTENT_TYPES = [
  { value: 'product', label: 'Product description', icon: '📦' },
  { value: 'social',  label: 'Social media post',   icon: '📱' },
  { value: 'email',   label: 'Marketing email',      icon: '✉️' },
  { value: 'bio',     label: 'Business bio',         icon: '👤' },
  { value: 'ad',      label: 'Ad copy',              icon: '📣' },
  { value: 'seo',     label: 'SEO blog intro',       icon: '🔍' },
]
