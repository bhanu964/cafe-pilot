import AIOrderAssistant from './AIOrderAssistant'

function AIOrder({ onOrderConfirm }) {
  return (
    <div className="ai-order-page">
      <AIOrderAssistant onOrderConfirm={onOrderConfirm} />
    </div>
  )
}

export default AIOrder
