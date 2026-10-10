import { useState } from 'react'

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI cafe assistant. I can help you with menu recommendations, dietary restrictions, or any questions about our offerings. What can I help you with today?",
      sender: 'assistant'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response with mock data
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getMockResponse(inputMessage),
        sender: 'assistant'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  const getMockResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
      return "I'd recommend our Cappuccino paired with a Croissant - a classic combo! For something sweet, try our Mocha with a Blueberry Muffin."
    } else if (lowerQuery.includes('vegan') || lowerQuery.includes('dietary')) {
      return "Our menu includes coffee and tea options that are naturally vegan. For food, some items may contain dairy. Let me know if you're looking for specific options!"
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      return "Our coffee ranges from $2.50 for Espresso to $5.50 for Mocha. Pastries are $3.00-$3.50. Would you like pricing for a specific item?"
    } else if (lowerQuery.includes('menu')) {
      return "We offer Espresso, Cappuccino, Latte, Americano, Mocha, Cold Brew, Croissants, and Blueberry Muffins. What would you like to order?"
    } else {
      return "Thanks for your question! I can help with menu recommendations, pricing, or any other cafe-related queries. How else can I assist you?"
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Cafe Assistant</h2>
        <p>Powered by AI • Ask me anything about our cafe</p>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <em>Typing...</em>
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me about recommendations, menu, etc..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
        />
        <button 
          className="send-btn"
          onClick={handleSend}
          disabled={isTyping || !inputMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat