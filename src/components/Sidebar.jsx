import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  Bot,
  Coffee,
  ImageIcon,
  Sparkles
} from 'lucide-react'

function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'playground', label: 'Playground', icon: Coffee },
    { id: 'ai-order', label: 'AI Order', icon: Sparkles },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'ai-assistant', label: 'AI Assistance', icon: Bot },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ]

  const handleItemClick = (id) => {
    setCurrentPage(id)
    onClose()
  }

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Coffee size={28} />
            <h1>Cafe Pilot</h1>
          </div>
          <p className="subtitle">AI Operations Dashboard</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            <span>System Online</span>
          </div>
        </div>
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  )
}

export default Sidebar
