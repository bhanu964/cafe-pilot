import { menuItems, findMenuItem } from '../data/menuDetailed.js'

/**
 * Check whether server-side Grok AI integration is reachable and configured.
 */
export async function checkAiHealth() {
  try {
    const res = await fetch('/api/ai/health')
    if (!res.ok) throw new Error('Health check failed')
    const data = await res.json()
    return {
      online: true,
      grokConfigured: Boolean(data.grokConfigured),
      provider: data.provider || (data.grokConfigured ? 'groq' : 'local'),
      model: data.model || 'openai/gpt-oss-120b'
    }
  } catch {
    return {
      online: false,
      grokConfigured: false,
      provider: 'local',
      model: 'local-fallback'
    }
  }
}

/**
 * Local rule-based order parser used as an instantaneous fallback
 * when Grok AI is offline, unconfigured, or encounters network errors.
 */
export function parseOrderLocal(text) {
  const numberWords = { 
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, 
    five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 
  }

  const foundItems = []
  // Split on delimiters like 'and', comma, '&', '+', 'plus'
  const segments = text.split(/,|\band\b|&|\+|\bplus\b/gi).map(s => s.trim()).filter(Boolean)

  for (const segment of segments) {
    const lowerSegment = segment.toLowerCase()
    let qty = 1

    // Extract quantity from segment
    const digitMatch = lowerSegment.match(/\b(\d+)\b/)
    if (digitMatch) {
      qty = parseInt(digitMatch[1], 10)
    } else {
      const wordMatch = lowerSegment.match(/\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten)\b/)
      if (wordMatch && numberWords[wordMatch[1]]) {
        qty = numberWords[wordMatch[1]]
      }
    }

    const item = findMenuItem(lowerSegment)
    if (item && !foundItems.some(f => f.item.id === item.id)) {
      foundItems.push({ item, quantity: qty })
    }
  }

  // If segments didn't find everything, fall back to direct keyword sweep
  if (foundItems.length === 0) {
    const lowerText = text.toLowerCase()
    for (const item of menuItems) {
      if (item.keywords.some(k => lowerText.includes(k))) {
        if (!foundItems.some(f => f.item.id === item.id)) {
          foundItems.push({ item, quantity: 1 })
        }
      }
    }
  }

  return foundItems
}

/**
 * Resolve and verify parsed items strictly against the application's menu catalog.
 * Guarantees that prices, IDs, and totals are 100% controlled by the application.
 */
function enforceApplicationPricing(rawItems) {
  const verifiedItems = []

  for (const raw of rawItems) {
    const rawName = String(raw.name || '').trim()
    const quantity = Math.max(1, parseInt(raw.quantity, 10) || 1)
    
    // Look up exact or keyword match in canonical application menu
    const catalogItem = findMenuItem(rawName) || 
      menuItems.find(m => m.name.toLowerCase() === rawName.toLowerCase())

    if (catalogItem) {
      // Avoid duplicate item lines: accumulate quantity
      const existing = verifiedItems.find(v => v.item.id === catalogItem.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        verifiedItems.push({
          item: {
            id: catalogItem.id,
            name: catalogItem.name,
            category: catalogItem.category,
            // Price is STRICTLY taken from the application menu data
            price: catalogItem.price
          },
          quantity
        })
      }
    }
  }

  const total = verifiedItems.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0)
  return { verifiedItems, total }
}

/**
 * Interprets natural language order using Grok LLM on the server,
 * with graceful fallback to local parsing if service is unavailable.
 */
export async function parseNaturalLanguageOrder(text) {
  if (!text || !text.trim()) {
    return {
      success: false,
      items: [],
      total: 0,
      source: 'local',
      message: 'Please provide an order description.'
    }
  }

  try {
    const response = await fetch('/api/ai/parse-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        menuCatalog: menuItems.map(m => ({
          name: m.name,
          category: m.category,
          keywords: m.keywords
        }))
      })
    })

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`)
    }

    const data = await response.json()

    // If Grok handled the request successfully
    if (data.success && data.data) {
      const rawItems = data.data.items || []
      const { verifiedItems, total } = enforceApplicationPricing(rawItems)

      return {
        success: true,
        items: verifiedItems,
        total,
        unrecognized: data.data.unrecognized || [],
        notes: data.data.notes || '',
        message: data.data.message || '',
        source: 'grok',
        model: data.model || 'grok-2-latest'
      }
    }

    // Server indicated fallback required (e.g. no key or rate limited)
    throw new Error(data.error || data.reason || 'AI interpretation unavailable')
  } catch {
    // Graceful offline/error fallback: use local parser with application pricing
    const localMatches = parseOrderLocal(text)
    const { verifiedItems, total } = enforceApplicationPricing(
      localMatches.map(m => ({ name: m.item.name, quantity: m.quantity }))
    )

    return {
      success: verifiedItems.length > 0,
      items: verifiedItems,
      total,
      unrecognized: [],
      notes: '',
      message: verifiedItems.length > 0 
        ? '' 
        : "I couldn't identify any menu items from that request. Try: '2 cappuccinos and 1 croissant'.",
      source: 'local-fallback',
      fallbackNotice: 'Processed via local engine (Grok AI currently offline or unconfigured)'
    }
  }
}

/**
 * Local operational insights response generator grounded in cafe metrics.
 */
function getLocalOperationsResponse(query, context = {}) {
  const q = query.toLowerCase()
  const { stats = {}, lowStockItems = [] } = context

  if (q.includes('inventory') || q.includes('stock')) {
    const lowCount = lowStockItems.length
    const lowNames = lowStockItems.map(i => i.name).join(', ')
    return `Inventory Alert: Currently, ${lowCount} items are below minimum safety stock (${lowNames || 'pastries & milk'}). Immediate reorders are recommended before tomorrow's morning rush.`
  }

  if (q.includes('staff') || q.includes('rush') || q.includes('shift')) {
    return `Staffing Optimization: Historical lunch rush peaks between 12:00 PM and 1:30 PM. With ${stats.activeOrders || 5} currently active orders, scheduling 1 additional barista during peak hours will maintain ticket times under 3 minutes.`
  }

  if (q.includes('revenue') || q.includes('sales') || q.includes('income')) {
    return `Sales Velocity: Today's revenue stands at $${(stats.todayRevenue || 0).toFixed(2)} across ${stats.totalOrders || 0} orders (Average Order Value: $${(stats.avgOrderValue || 0).toFixed(2)}). Cold beverages and combo orders are the primary revenue drivers.`
  }

  if (q.includes('menu') || q.includes('popular') || q.includes('price')) {
    return `Menu Intelligence: Cappuccino, Latte, and Croissant pairings represent our highest-margin combination. All menu prices and inventory costs remain locked to application standards.`
  }

  return `Cafe Operations Overview: Current revenue is $${(stats.todayRevenue || 0).toFixed(2)} across ${stats.totalOrders || 0} orders with ${stats.activeOrders || 0} active orders. Low stock items require replenishment.`
}

/**
 * Fetch operational insights using Grok LLM grounded in real cafe data,
 * with fallback to local rule-based insights if Grok is unavailable.
 */
export async function getOperationsInsight(query, cafeContext = {}) {
  if (!query || !query.trim()) {
    return {
      text: 'Please enter a question regarding cafe operations, staffing, inventory, or sales.',
      source: 'local'
    }
  }

  try {
    const response = await fetch('/api/ai/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        cafeContext
      })
    })

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.response) {
      return {
        text: data.response,
        source: 'grok',
        model: data.model || 'grok-2-latest'
      }
    }

    throw new Error(data.error || data.reason || 'AI operations unavailable')
  } catch {
    return {
      text: getLocalOperationsResponse(query, cafeContext),
      source: 'local-fallback',
      fallbackNotice: 'Operating in local offline mode (Grok AI currently offline or unconfigured)'
    }
  }
}
