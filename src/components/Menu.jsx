function Menu({ items, onAddToCart }) {
  return (
    <div className="menu">
      {items.map(item => (
        <div key={item.id} className="menu-item">
          <h3>{item.name}</h3>
          <p className="description">{item.description}</p>
          <p className="price">${item.price.toFixed(2)}</p>
          <button 
            className="add-btn"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}

export default Menu