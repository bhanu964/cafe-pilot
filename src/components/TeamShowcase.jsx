import { Users, Award } from 'lucide-react'
import chef from '../assets/images/chef.jpg'
import kitchen from '../assets/images/kitchen.jpg'

function TeamShowcase() {
  const team = [
    {
      id: 1,
      name: "Marcus Chen",
      role: "Head Barista & Roaster",
      image: chef,
      experience: "10+ Years",
      specialty: "Latte Art Champion"
    },
    {
      id: 2,
      name: "Sophia Patel",
      role: "Pastry Chef",
      image: kitchen,
      experience: "8+ Years",
      specialty: "Artisanal Baking"
    }
  ]

  return (
    <div className="team-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <Users size={22} />
          <h2>Meet Our Artisans</h2>
        </div>
        <p className="section-subtitle">The passionate souls behind every perfect cup</p>
      </div>
      
      <div className="team-grid">
        {team.map((member, index) => (
          <div 
            key={member.id} 
            className="team-card"
            style={{ animationDelay: `${0.5 + index * 0.15}s` }}
          >
            <div className="team-image-wrapper">
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="team-overlay">
                <Award size={20} />
                <span>{member.specialty}</span>
              </div>
            </div>
            <div className="team-content">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <span className="team-experience">{member.experience}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamShowcase
