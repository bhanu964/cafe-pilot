import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Orders from './components/Orders'
import Inventory from './components/Inventory'
import AIAssistant from './components/AIAssistant'
import Playground from './components/Playground'
import Gallery from './components/Gallery'
import AIOrder from './components/AIOrder'
import { updateDashboard } from './data/ordersStore'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('ai-order')
  const [refreshDashboard, setRefreshDashboard] = useState(0)

  const handleOrderConfirm = (orderItems, total) => {
    updateDashboard(orderItems, total)
    setRefreshDashboard(prev => prev + 1)
    setTimeout(() => {
      setCurrentPage('dashboard')
    }, 1000)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard key={refreshDashboard} />
      case 'playground':
        return <Playground />
      case 'ai-order':
        return <AIOrder onOrderConfirm={handleOrderConfirm} />
      case 'orders':
        return <Orders />
      case 'inventory':
        return <Inventory />
      case 'ai-assistant':
        return <AIAssistant />
      case 'gallery':
        return <Gallery />
      default:
        return <AIOrder onOrderConfirm={handleOrderConfirm} />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
