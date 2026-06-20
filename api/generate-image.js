import https from 'https'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const { prompt } = req.body || {}
  if (!prompt) { res.status(400).json({ error: 'Prompt is required' }); return }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel environment variables.' })
  }

  const body = JSON.stringify({
    contents: [{
      parts: [{ text: `Generate a high quality professional image for a Nigerian business: ${prompt}. Make it photorealistic, vibrant and commercial quality.` }]
    }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
  })

  const path = `/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }

    const chunks = []

    const httpReq = https.request(options, (httpRes) => {
      httpRes.on('data', chunk => chunks.push(chunk))
      httpRes.on('end', () => {
        const text = Buffer.concat(chunks).toString()
        let data
        try { data = JSON.parse(text) } catch {
          res.status(500).json({ error: 'Invalid response from Gemini' })
          return resolve()
        }

        if (data.error) {
          res.status(500).json({ error: data.error.message || 'Gemini error' })
          return resolve()
        }

        // Find image part in response
        const parts = data.candidates?.[0]?.content?.parts || []
        const imgPart = parts.find(p => p.inlineData?.mimeType?.startsWith('image'))

        if (!imgPart) {
          res.status(500).json({ error: 'No image in response. Gemini image generation may not be enabled for your API key yet.' })
          return resolve()
        }

        const { mimeType, data: imgData } = imgPart.inlineData
        res.status(200).json({ image: `data:${mimeType};base64,${imgData}` })
        resolve()
      })
    })

    httpReq.on('error', (err) => {
      res.status(500).json({ error: 'Connection failed: ' + err.message })
      resolve()
    })

    httpReq.setTimeout(55000, () => {
      httpReq.destroy()
      res.status(504).json({ error: 'Timed out — please try again.' })
      resolve()
    })

    httpReq.write(body)
    httpReq.end()
  })
}
