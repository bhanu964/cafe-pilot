import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { 
  getActiveAiDetails,
  interpretOrderWithGrok, 
  generateOperationalInsightsWithGrok 
} from './server/grokService.js'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function grokApiMiddleware(env) {
  return async (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : ''

    if (url === '/api/ai/health' && req.method === 'GET') {
      const details = getActiveAiDetails(env)
      return sendJson(res, 200, {
        status: 'ok',
        grokConfigured: details.configured,
        provider: details.provider,
        model: details.model
      })
    }

    if (url === '/api/ai/parse-order' && req.method === 'POST') {
      try {
        const body = await readJsonBody(req)
        const { text, menuCatalog } = body
        if (!text || typeof text !== 'string') {
          return sendJson(res, 400, { error: 'Order text is required.' })
        }
        const result = await interpretOrderWithGrok(text, menuCatalog || [], env)
        return sendJson(res, 200, result)
      } catch (err) {
        return sendJson(res, 500, { 
          success: false, 
          fallbackRequired: true, 
          error: err.message || 'Internal server error processing order.' 
        })
      }
    }

    if (url === '/api/ai/operations' && req.method === 'POST') {
      try {
        const body = await readJsonBody(req)
        const { query, cafeContext } = body
        if (!query || typeof query !== 'string') {
          return sendJson(res, 400, { error: 'Query is required.' })
        }
        const result = await generateOperationalInsightsWithGrok(query, cafeContext || {}, env)
        return sendJson(res, 200, result)
      } catch (err) {
        return sendJson(res, 500, { 
          success: false, 
          fallbackRequired: true, 
          error: err.message || 'Internal server error generating insights.' 
        })
      }
    }

    return next()
  }
}

function grokApiPlugin(env) {
  const attachMiddleware = (server) => {
    server.middlewares.use(grokApiMiddleware(env))
  }
  return {
    name: 'cafe-pilot-grok-api',
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      grokApiPlugin(env)
    ]
  }
})
