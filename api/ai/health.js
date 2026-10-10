import { getActiveAiDetails } from '../../server/grokService.js'

export default function handler(req, res) {
  const details = getActiveAiDetails(process.env)
  res.status(200).json({
    status: 'ok',
    grokConfigured: details.configured,
    provider: details.provider,
    model: details.model
  })
}
