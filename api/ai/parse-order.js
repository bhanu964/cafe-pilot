import { interpretOrderWithGrok } from '../../server/grokService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text, menuCatalog } = req.body || {}
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Order text is required.' })
    }

    const result = await interpretOrderWithGrok(text, menuCatalog || [], process.env)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: err.message || 'Server error processing order.'
    })
  }
}
