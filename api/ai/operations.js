import { generateOperationalInsightsWithGrok } from '../../server/grokService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { query, cafeContext } = req.body || {}
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required.' })
    }

    const result = await generateOperationalInsightsWithGrok(query, cafeContext || {}, process.env)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: err.message || 'Server error generating operational insights.'
    })
  }
}
