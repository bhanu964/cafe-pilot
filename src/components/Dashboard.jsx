import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { popularItems, lowStockItems, aiInsights } from '../data/dashboard'
import { dashboardStats } from '../data/ordersStore'

function StatCard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon">
          <Icon size={22} />
        </div>
        {trend && (
          <div className="stat-trend">
            <ArrowUpRight size={16} />
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const stats = {
    todayRevenue: dashboardStats.todayRevenue,
    totalOrders: dashboardStats.totalOrders,
    avgOrderValue: dashboardStats.avgOrderValue,
    activeOrders: dashboardStats.activeOrders,
  }
  const recentOrders = dashboardStats.recentOrders

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! AI Order updates reflected in real-time</p>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          title="Today's Revenue" 
          value={`$${stats.todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign}
          trend={true}
          trendValue={12.5}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag}
          trend={true}
          trendValue={8.3}
        />
        <StatCard 
          title="Avg Order Value" 
          value={`$${stats.avgOrderValue.toFixed(2)}`} 
          icon={TrendingUp}
          trend={true}
          trendValue={5.7}
        />
        <StatCard 
          title="Active Orders" 
          value={stats.activeOrders} 
          icon={Clock}
          trend={false}
        />
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Popular Menu Items</h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {popularItems.map((item, index) => (
                    <tr key={item.id} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                      <td>
                        <div className="item-name">
                          <span className="rank">{index + 1}</span>
                          {item.name}
                        </div>
                      </td>
                      <td>{item.orders}</td>
                      <td>${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Low Stock Items</h2>
            <AlertTriangle size={18} className="warning-icon" />
          </div>
          <div className="card-body">
            <div className="low-stock-list">
              {lowStockItems.map((item, index) => (
                <div key={item.id} className="low-stock-item" style={{ animationDelay: `${0.15 + index * 0.05}s` }}>
                  <div className="low-stock-info">
                    <h4>{item.name}</h4>
                    <p>{item.stock} left / {item.threshold} min</p>
                  </div>
                  <div className="stock-bar">
                    <div 
                      className="stock-bar-fill" 
                      style={{ width: `${(item.stock / item.threshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card card-wide">
          <div className="card-header">
            <h2>Recent Orders</h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id} style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="order-items">{order.items.join(", ")}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="card ai-insight-card">
          <div className="card-header">
            <h2>AI Insights</h2>
            <Sparkles size={18} className="sparkle-icon" />
          </div>
          <div className="card-body">
            <div className="ai-insights-list">
              {aiInsights.map((insight, index) => (
                <div key={index} className="ai-insight-item" style={{ animationDelay: `${0.25 + index * 0.05}s` }}>
                  <div className="insight-dot"></div>
                  <div className="insight-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
