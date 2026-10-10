import { Sparkles, ArrowRight } from 'lucide-react'
import cafeCoffee from '../assets/images/cafe-coffee.jpg'

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-image-container">
        <img src={cafeCoffee} alt="Cozy cafe atmosphere with coffee" className="hero-bg-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>AI-Powered Operations</span>
        </div>
        <h1 className="hero-title">
          Welcome to <span className="hero-highlight">Cafe Pilot</span>
        </h1>
        <p className="hero-subtitle">
          Where craft meets intelligence. Experience the perfect blend of artisanal coffee and smart operations.
        </p>
        <div className="hero-actions">
          <button className="hero-btn-primary">
            Explore Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
