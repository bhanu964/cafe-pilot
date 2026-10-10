import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

function Layout({ children, currentPage, setCurrentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="main-area">
        {children}
      </main>
    </div>
  )
}

export default Layout
