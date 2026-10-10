import { Coffee, Star } from 'lucide-react'
import espresso from '../assets/images/espresso.jpg'
import cappuccino from '../assets/images/cappuccino.jpg'

function FeaturedDrinks() {
  const drinks = [
    {
      id: 1,
      name: "Signature Espresso",
      image: espresso,
      description: "Double shot pulled to perfection with rich crema",
      rating: 4.9,
      price: "$3.50"
    },
    {
      id: 2,
      name: "Velvet Cappuccino",
      image: cappuccino,
      description: "Silky microfoam meets bold espresso artistry",
      rating: 4.8,
      price: "$4.75"
    }
  ]

  return (
    <div className="featured-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <Coffee size={22} />
          <h2>Featured Creations</h2>
        </div>
        <p className="section-subtitle">Crafted with passion, served with perfection</p>
      </div>
      
      <div className="featured-grid">
        {drinks.map((drink, index) => (
          <div 
            key={drink.id} 
            className="featured-card"
            style={{ animationDelay: `${0.3 + index * 0.15}s` }}
          >
            <div className="featured-image-wrapper">
              <img src={drink.image} alt={drink.name} className="featured-image" />
              <div className="featured-badge">
                <Star size={14} fill="var(--gold)" />
                <span>{drink.rating}</span>
              </div>
            </div>
            <div className="featured-content">
              <h3 className="featured-name">{drink.name}</h3>
              <p className="featured-description">{drink.description}</p>
              <div className="featured-meta">
                <span className="featured-price">{drink.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedDrinks
