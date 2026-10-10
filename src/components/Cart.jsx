function Cart({ items, onUpdateQuantity, onRemoveFromCart, total }) {
  if (items.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty. Start adding items from the menu!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)} each</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <span className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              
              <button 
                className="remove-btn"
                onClick={() => onRemoveFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-total">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  )
}

export default Cart