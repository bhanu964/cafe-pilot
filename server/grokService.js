// Server-side service for interacting with Groq / xAI LLM
// Keeps API keys strictly on the server and provides grounded outputs

function getProviderConfig(env = {}) {
  const key = (
    env.GROQ_API_KEY || 
    env.GROK_API_KEY || 
    env.XAI_API_KEY || 
    process.env.GROQ_API_KEY || 
    process.env.GROK_API_KEY || 
    process.env.XAI_API_KEY || 
    ''
  ).trim()

  const isGroq = key.startsWith('gsk_') || Boolean(env.GROQ_API_KEY || process.env.GROQ_API_KEY)

  if (isGroq) {
    return {
      provider: 'groq',
      apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
      defaultModel: env.GROQ_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      apiKey: key
    }
  }

  return {
    provider: 'xai',
    apiUrl: 'https://api.x.ai/v1/chat/completions',
    defaultModel: env.GROK_MODEL || process.env.GROK_MODEL || 'grok-2-latest',
    apiKey: key
  }
}

/**
 * Clean potential markdown wrappers from LLM JSON response
 */
function cleanJsonOutput(text) {
  if (!text) return '{}'
  const trimmed = text.trim()
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim()
  }
  return trimmed
}

/**
 * Check if Groq / xAI API key is configured
 */
export function isGrokConfigured(env = {}) {
  const config = getProviderConfig(env)
  return Boolean(config.apiKey && config.apiKey.length > 0)
}

/**
 * Get active AI provider details
 */
export function getActiveAiDetails(env = {}) {
  const config = getProviderConfig(env)
  return {
    configured: Boolean(config.apiKey && config.apiKey.length > 0),
    provider: config.provider,
    model: config.defaultModel
  }
}

/**
 * Call Groq or xAI Chat Completions API
 */
async function callAi(messages, { env = {}, temperature = 0.2, maxTokens = 600, jsonMode = false } = {}) {
  const config = getProviderConfig(env)
  if (!config.apiKey) {
    throw new Error('API key is not configured on the server.')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  const payload = {
    model: config.defaultModel,
    messages,
    temperature,
    max_tokens: maxTokens
  }

  if (jsonMode) {
    payload.response_format = { type: 'json_object' }
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`AI API responded with HTTP ${response.status}: ${errorText || response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('AI API returned an empty response.')
    }
    return { content, model: data.model || config.defaultModel, provider: config.provider }
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('AI API request timed out after 12s.')
    }
    throw err
  }
}

/**
 * Interpret natural language cafe order using Groq / xAI.
 * Prices are strictly controlled by the application catalog.
 */
export async function interpretOrderWithGrok(orderText, menuCatalog = [], env = {}) {
  const config = getProviderConfig(env)
  if (!config.apiKey) {
    return {
      success: false,
      fallbackRequired: true,
      reason: 'No API key configured on server'
    }
  }

  const catalogSummary = menuCatalog
    .map(item => `- ${item.name} (${item.category}, keywords: ${(item.keywords || []).join(', ')})`)
    .join('\n')

  const systemPrompt = `You are the order interpretation AI for Cafe Pilot.
The authorized cafe menu items are:
${catalogSummary}

Customer order text to interpret: "${orderText}"

TASK:
1. Identify all ordered items from the menu and their quantities.
2. Match items to their exact authorized menu name.
3. If an item is mentioned that is not on the menu, place it into "unrecognized".
4. NOTE: Do NOT calculate or return prices. Prices and totals are strictly controlled and calculated by the application.
5. If the input is a greeting or general inquiry (not an order), return an empty items list with a helpful "message".

You MUST reply with a JSON object in this exact shape:
{
  "items": [
    { "name": "Exact Menu Name", "quantity": 1 }
  ],
  "unrecognized": [],
  "notes": "",
  "message": ""
}
`

  try {
    const { content, model, provider } = await callAi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: orderText }
    ], { env, temperature: 0.1, maxTokens: 400, jsonMode: true })

    const parsedJson = JSON.parse(cleanJsonOutput(content))

    return {
      success: true,
      provider,
      model,
      data: {
        items: Array.isArray(parsedJson.items) ? parsedJson.items : [],
        unrecognized: Array.isArray(parsedJson.unrecognized) ? parsedJson.unrecognized : [],
        notes: parsedJson.notes || '',
        message: parsedJson.message || ''
      }
    }
  } catch (err) {
    return {
      success: false,
      fallbackRequired: true,
      error: err.message
    }
  }
}

/**
 * Generate operational insights grounded in current cafe metrics.
 * Menu prices and inventory figures remain controlled by the application.
 */
export async function generateOperationalInsightsWithGrok(query, cafeContext = {}, env = {}) {
  const config = getProviderConfig(env)
  if (!config.apiKey) {
    return {
      success: false,
      fallbackRequired: true,
      reason: 'No API key configured on server'
    }
  }

  const { stats = {}, lowStockItems = [], popularItems = [], inventorySummary = {} } = cafeContext

  const systemPrompt = `You are the AI Operations Intelligence Assistant for Cafe Pilot.
You provide executive recommendations for inventory restocking, rush hour staffing, sales velocity, and menu optimization.

CRITICAL DIRECTIVES:
1. Base your responses STRICTLY on the real cafe operational metrics provided below.
2. The application's menu prices, inventory costs, and stock levels are AUTHORITATIVE. Do NOT invent new prices, modify existing menu prices, or fabricate inventory values.
3. Provide concise, professional, data-backed insights with clear next steps.
4. FORMATTING & READABILITY:
   - Structure your response cleanly with clear section headings (e.g. "### Summary", "### Priority Actions").
   - Use structured bullet points and clean comparison tables for figures.
   - Keep formatting polished, human-readable, and executive-ready without cluttered raw symbols.

REAL CAFE DATA:
- Today's Revenue: $${(stats.todayRevenue || 0).toFixed(2)}
- Total Orders: ${stats.totalOrders || 0}
- Average Order Value: $${(stats.avgOrderValue || 0).toFixed(2)}
- Active Orders: ${stats.activeOrders || 0}
- Low Stock Items: ${JSON.stringify(lowStockItems)}
- Popular Items: ${JSON.stringify(popularItems)}
- Inventory Summary: Total Items: ${inventorySummary.totalItems || 0}, Low Stock Count: ${inventorySummary.lowStockCount || 0}, Total Value: $${(inventorySummary.totalValue || 0).toFixed(2)}
`

  try {
    const { content, model, provider } = await callAi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ], { env, temperature: 0.3, maxTokens: 600, jsonMode: false })

    return {
      success: true,
      provider,
      model,
      response: content.trim()
    }
  } catch (err) {
    return {
      success: false,
      fallbackRequired: true,
      error: err.message
    }
  }
}
