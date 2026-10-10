import { Package, AlertTriangle, TrendingDown, Boxes } from 'lucide-react'
import { inventory } from '../data/inventory'

function Inventory() {
  const lowStock = inventory.filter(item => item.currentStock <= item.minThreshold)
  const totalItems = inventory.length
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
  
  const getEndOfDayPrediction = (item) => {
    // Simulate consumption based on typical cafe usage
    const dailyUsageRates = {
      "Espresso Beans": 0.5,
      "Coffee Powder": 0.3,
      "Whole Milk": 2.0,
      "Oat Milk": 1.5,
      "Almond Milk": 1.0,
      "Dark Chocolate Syrup": 0.2,
      "Vanilla Syrup": 0.2,
      "Croissants": 5.0,
      "Blueberry Muffins": 4.0,
      "Chocolate Chip Cookies": 6.0,
      "Bread Slices": 8.0,
      "Cheese Slices": 6.0,
      "Ham Slices": 4.0,
      "Avocado": 2.0,
      "Green Tea Leaves": 0.05,
      "Black Tea Leaves": 0.05,
      "Ice Cubes": 50.0,
      "Paper Cups": 30.0,
    }
    const dailyUse = dailyUsageRates[item.name] || 0
    const endOfDay = Math.max(0, item.currentStock - dailyUse)
    return endOfDay
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Stock levels, quantities, and end-of-day predictions</p>
      </div>
      
      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-icon total-items">
            <Boxes size={22} />
          </div>
          <div className="summary-info">
            <h3>{totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon low-stock">
            <AlertTriangle size={22} />
          </div>
          <div className="summary-info">
            <h3>{lowStock.length}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon inventory-value">
            <Package size={22} />
          </div>
          <div className="summary-info">
            <h3>${totalValue.toFixed(2)}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>Inventory Details</h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table inventory-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Current Qty</th>
                  <th>Unit</th>
                  <th>Min Threshold</th>
                  <th>Status</th>
                  <th>EOD Prediction</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => {
                  const endOfDay = getEndOfDayPrediction(item)
                  const isLow = item.currentStock <= item.minThreshold
                  const endOfDayLow = endOfDay <= item.minThreshold
                  return (
                    <tr key={item.id} style={{ animationDelay: `${0.05 + index * 0.02}s` }}>
                      <td className="item-name-cell">{item.name}</td>
                      <td>{item.category}</td>
                      <td className="stock-qty">{item.currentStock}</td>
                      <td>{item.unit}</td>
                      <td>{item.minThreshold}</td>
                      <td>
                        {isLow ? (
                          <span className="status-badge status-low">
                            <AlertTriangle size={12} />
                            Low Stock
                          </span>
                        ) : (
                          <span className="status-badge status-ok">In Stock</span>
                        )}
                      </td>
                      <td className={endOfDayLow ? 'eod-warning' : 'eod-ok'}>
                        <div className="eod-cell">
                          <span>{endOfDay.toFixed(1)} {item.unit}</span>
                          {endOfDayLow && <TrendingDown size={14} />}
                        </div>
                      </td>
                      <td>{item.supplier}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
