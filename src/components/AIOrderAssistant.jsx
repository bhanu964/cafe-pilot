import { useState, useEffect } from 'react'
import { Bot, Send, Sparkles, CheckCircle, ShoppingCart, X, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { parseNaturalLanguageOrder, checkAiHealth } from '../services/aiService'
import FormattedMessage from './FormattedMessage'

function AIOrderAssistant({ onOrderConfirm }) {
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      type: 'assistant',
      text: "Hi! I'm your AI Order Assistant powered by Grok. Tell me what you'd like in natural language - like 'two cold coffees and one cheese sandwich' and I'll interpret it for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingOrder, setPendingOrder] = useState(null)
  const [pendingNotes, setPendingNotes] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput || isProcessing) return

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: trimmedInput,
      timestamp: currentTime
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      const result = await parseNaturalLanguageOrder(trimmedInput)
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      let assistantText = ''
      if (result.items && result.items.length > 0) {
        const itemList = result.items.map(p => `${p.quantity}x ${p.item.name}`).join(', ')
        assistantText = `I got that! Interpreted order: ${itemList}. All prices are verified from our official cafe menu.`
        if (result.notes) {
          assistantText += ` (Special instructions: ${result.notes})`
        }
      } else if (result.message) {
        assistantText = result.message
      } else {
        assistantText = "I couldn't identify any cafe menu items from that request. Try: '2 cappuccinos and 1 chocolate chip cookie'."
      }

      const assistantMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: assistantText,
        timestamp: replyTime,
        source: result.source,
        fallbackNotice: result.fallbackNotice,
        unrecognized: result.unrecognized,
        notes: result.notes,
        parsedOrder: result.items && result.items.length > 0 ? result.items : null
      }

      setMessages(prev => [...prev, assistantMsg])

      if (result.items && result.items.length > 0) {
        setPendingOrder(result.items)
        setPendingNotes(result.notes || '')
      }
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        text: "Encountered an issue processing your order. Please try again or rephrase.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'error'
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmOrder = () => {
    if (!pendingOrder || pendingOrder.length === 0) return

    // Strict application calculation
    const total = pendingOrder.reduce((sum, p) => sum + (p.item.price * p.quantity), 0)
    const confirmedMsg = {
      id: Date.now(),
      type: 'assistant',
      text: `Order confirmed successfully! Order total: $${total.toFixed(2)}. The dashboard has been updated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confirmed: true
    }

    setMessages(prev => [...prev, confirmedMsg])
    onOrderConfirm(pendingOrder, total)
    setPendingOrder(null)
    setPendingNotes('')
  }

  const cancelOrder = () => {
    setPendingOrder(null)
    setPendingNotes('')
    const cancelMsg = {
      id: Date.now(),
      type: 'assistant',
      text: "Order cancelled. Feel free to place another order!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, cancelMsg])
  }

  return (
    <div className="ai-order-container">
      <div className="ai-order-header">
        <div className="ai-order-title-wrapper">
          <Bot size={24} />
          <h1>AI Order Assistant</h1>
        </div>
        <p className="ai-order-subtitle">Natural language ordering • Application-controlled pricing • Real-time sync</p>
        
        <div className="ai-status-pill">
          {aiStatus.grokConfigured ? (
            <span className="status-badge status-ok">
              <Wifi size={12} /> {aiStatus.provider === 'groq' ? 'Groq' : 'Grok'} AI Active ({aiStatus.model})
            </span>
          ) : (
            <span className="status-badge status-low" title="Configure GROQ_API_KEY in server/.env to enable live AI">
              <WifiOff size={12} /> Local Fallback Engine Active (API Key Offline)
            </span>
          )}
        </div>
      </div>

      <div className="ai-chat-wrapper">
        <div className="ai-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message ${msg.type}`}>
              <div className="ai-message-avatar">
                {msg.type === 'assistant' ? <Bot size={18} /> : <span>👤</span>}
              </div>
              <div className="ai-message-content">
                {msg.type === 'assistant' ? (
                  <FormattedMessage content={msg.text} />
                ) : (
                  <p>{msg.text}</p>
                )}
                
                {msg.fallbackNotice && (
                  <div className="ai-fallback-tag">
                    <AlertCircle size={12} />
                    <span>{msg.fallbackNotice}</span>
                  </div>
                )}

                {msg.unrecognized && msg.unrecognized.length > 0 && (
                  <div className="ai-warning-box">
                    <span>Note: Unavailable item(s) skipped: {msg.unrecognized.join(', ')}</span>
                  </div>
                )}

                {msg.parsedOrder && (
                  <div className="parsed-order-preview">
                    <div className="parsed-order-header">
                      <ShoppingCart size={16} />
                      <span>Order Summary (Official Catalog Prices)</span>
                    </div>
                    {msg.parsedOrder.map((p, idx) => (
                      <div key={idx} className="parsed-item">
                        <span>{p.quantity}x {p.item.name}</span>
                        <span>${(p.item.price * p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="parsed-total">
                      <span>Total:</span>
                      <span>${msg.parsedOrder.reduce((sum, p) => sum + (p.item.price * p.quantity), 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="ai-message assistant">
              <div className="ai-message-avatar">
                <Bot size={18} />
              </div>
              <div className="ai-message-content">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
                <small className="processing-hint">Grok AI is interpreting your order...</small>
              </div>
            </div>
          )}
        </div>

        {pendingOrder && (
          <div className="order-confirmation-panel">
            <div className="confirmation-header">
              <Sparkles size={20} className="sparkle-icon" />
              <h3>Confirm Your Order</h3>
            </div>
            {pendingNotes && (
              <div className="order-notes-tag">
                <strong>Special Request:</strong> {pendingNotes}
              </div>
            )}
            <div className="confirmation-items">
              {pendingOrder.map((p, idx) => (
                <div key={idx} className="confirm-item">
                  <div className="confirm-item-info">
                    <span className="confirm-qty">{p.quantity}x</span>
                    <span className="confirm-name">{p.item.name}</span>
                  </div>
                  <span className="confirm-price">${(p.item.price * p.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="confirmation-total">
              <span>Total:</span>
              <span className="total-amount">
                ${pendingOrder.reduce((sum, p) => sum + (p.item.price * p.quantity), 0).toFixed(2)}
              </span>
            </div>
            <div className="confirmation-actions">
              <button className="confirm-btn" onClick={confirmOrder}>
                <CheckCircle size={18} />
                Confirm Order
              </button>
              <button className="cancel-btn" onClick={cancelOrder}>
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        <form className="ai-order-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              className="ai-order-input"
              placeholder="e.g., '2 cold coffees and 1 cheese sandwich'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing || pendingOrder !== null}
            />
            <button 
              type="submit" 
              className="ai-order-send"
              disabled={isProcessing || !input.trim() || pendingOrder !== null}
              aria-label="Send Order"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AIOrderAssistant
