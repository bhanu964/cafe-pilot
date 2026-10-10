import { ClipboardList, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { todayOrders, todaysIncome } from '../data/orders'

function Orders() {
  const completedOrders = todayOrders.filter(o => o.status === 'completed')
  const preparingOrders = todayOrders.filter(o => o.status === 'preparing')
  const readyOrders = todayOrders.filter(o => o.status === 'ready')

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Today's Orders</h1>
        <p>Track all orders for today - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
      
      <div className="orders-summary">
        <div className="summary-card">
          <div className="summary-icon total-orders">
            <ClipboardList size={22} />
          </div>
          <div className="summary-info">
            <h3>{todayOrders.length}</h3>
            <p>Total Orders Today</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon income">
            <DollarSign size={22} />
          </div>
          <div className="summary-info">
            <h3>${todaysIncome.toFixed(2)}</h3>
            <p>Income Generated Today</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon completed">
            <CheckCircle size={22} />
          </div>
          <div className="summary-info">
            <h3>{completedOrders.length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon pending">
            <Clock size={22} />
          </div>
          <div className="summary-info">
            <h3>{preparingOrders.length + readyOrders.length}</h3>
            <p>In Progress</p>
          </div>
        </div>
      </div>
      
      <div className="orders-table-container">
        <div className="card">
          <div className="card-header">
            <h2>Today's Order Ledger</h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {todayOrders.map((order, index) => (
                    <tr key={order.id} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="order-items">{order.items.join(', ')}</td>
                      <td>{order.quantity}</td>
                      <td className="order-total">${order.total.toFixed(2)}</td>
                      <td>{order.paymentMethod}</td>
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
      </div>
      
      <div className="previous-orders-note">
        <p>Previous days' order ledger will be available when connected to a database.</p>
      </div>
    </div>
  )
}

export default Orders
