import { Bot, Send, Sparkles, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getOperationsInsight, checkAiHealth } from '../services/aiService'
import FormattedMessage from './FormattedMessage'
import { dashboardStats } from '../data/ordersStore'
import { popularItems } from '../data/dashboard'
import { inventory } from '../data/inventory'

function AIAssistant() {
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      text: "Hello! I'm your Cafe Pilot AI Operations Assistant powered by Grok. I analyze real-time cafe telemetry—including sales, inventory thresholds, and rush patterns—to give you actionable operational intelligence. What would you like to examine today?",
      sender: 'assistant',
      source: 'system'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiStatus, setAiStatus] = useState({ online: true, grokConfigured: false, model: 'checking' })

  useEffect(() => {
    let mounted = true
    checkAiHealth().then(status => {
      if (mounted) {
        setAiStatus(status)
      }
    })
    return () => { mounted = false }
  }, [])

  // Build real cafe context grounded strictly in application values
  const buildCafeContext = () => {
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
    const activeLowStock = inventory.filter(i => i.currentStock <= i.minThreshold)

    return {
      stats: {
        todayRevenue: dashboardStats.todayRevenue,
        totalOrders: dashboardStats.totalOrders,
        avgOrderValue: dashboardStats.avgOrderValue,
        activeOrders: dashboardStats.activeOrders
      },
      lowStockItems: activeLowStock.map(i => ({
        name: i.name,
        currentStock: `${i.currentStock} ${i.unit}`,
        minThreshold: `${i.minThreshold} ${i.unit}`,
        supplier: i.supplier
      })),
      popularItems: popularItems.map(p => ({
        name: p.name,
        orders: p.orders,
        revenue: `$${p.revenue.toFixed(2)}`
      })),
      inventorySummary: {
        totalItems: inventory.length,
        lowStockCount: activeLowStock.length,
        totalValue: totalInventoryValue
      }
    }
  }

  const handleSend = async (customPrompt) => {
    const promptToSend = (typeof customPrompt === 'string' ? customPrompt : inputMessage).trim()
    if (!promptToSend || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: promptToSend,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const cafeContext = buildCafeContext()
      const insightResult = await getOperationsInsight(promptToSend, cafeContext)

      const aiResponse = {
        id: Date.now() + 1,
        text: insightResult.text,
        sender: 'assistant',
        source: insightResult.source,
        fallbackNotice: insightResult.fallbackNotice,
        model: insightResult.model
      }

      setMessages(prev => [...prev, aiResponse])
    } catch {
      const errorResponse = {
        id: Date.now() + 1,
        text: "Could not generate operational insight at this moment. Please try again.",
        sender: 'assistant',
        source: 'error'
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    "Identify urgent inventory reorders",
    "Analyze today's sales velocity & revenue",
    "Recommend staffing for the upcoming rush",
    "What are our top revenue-generating menu items?"
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI Assistance</h1>
        <p>Operational intelligence & forecasting powered by Grok LLM</p>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-title-wrapper">
            <Bot size={22} />
            <h2>Cafe Pilot AI Operations</h2>
          </div>
          <div className="ai-status-pill">
            {aiStatus.grokConfigured ? (
              <span className="status-badge status-ok">
                <Wifi size={12} /> {aiStatus.provider === 'groq' ? 'Groq' : 'Grok'} AI Active ({aiStatus.model})
              </span>
            ) : (
              <span className="status-badge status-low">
                <WifiOff size={12} /> Local Operations Engine (Fallback)
              </span>
            )}
          </div>
        </div>

        <div className="quick-prompts-bar">
          <span className="quick-prompts-label">Quick Insights:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="quick-prompt-chip"
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
            >
              <Sparkles size={12} />
              {prompt}
            </button>
          ))}
        </div>

        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.sender === 'assistant' ? (
                <FormattedMessage content={message.text} />
              ) : (
                <div className="message-text">{message.text}</div>
              )}
              {message.fallbackNotice && (
                <div className="ai-fallback-tag">
                  <AlertCircle size={12} />
                  <span>{message.fallbackNotice}</span>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <small className="processing-hint">Synthesizing cafe telemetry with Grok AI...</small>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about inventory reorders, rush staffing, revenue trends..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
          />
          <button 
            className="send-btn"
            onClick={() => handleSend()}
            disabled={isTyping || !inputMessage.trim()}
            aria-label="Send Message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
