import { Heart, Sparkles } from 'lucide-react'
import pastry from '../assets/images/pastry.jpg'

function Atmosphere() {
  return (
    <div className="atmosphere-section">
      <div className="atmosphere-grid">
        <div className="atmosphere-image-container">
          <img src={pastry} alt="Freshly baked pastries" className="atmosphere-image" />
        </div>
        <div className="atmosphere-content">
          <div className="atmosphere-badge">
            <Heart size={16} />
            <span>Made with Love</span>
          </div>
          <h2 className="atmosphere-title">More Than Just Coffee</h2>
          <p className="atmosphere-text">
            Step into a sanctuary where the aroma of freshly roasted beans mingles with warm pastries. 
            Every moment here is crafted to awaken your senses and nourish your soul.
          </p>
          <div className="atmosphere-features">
            <div className="feature-item">
              <Sparkles size={18} />
              <span>Fresh Daily</span>
            </div>
            <div className="feature-item">
              <Sparkles size={18} />
              <span>Ethically Sourced</span>
            </div>
            <div className="feature-item">
              <Sparkles size={18} />
              <span>Small Batch Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Atmosphere
