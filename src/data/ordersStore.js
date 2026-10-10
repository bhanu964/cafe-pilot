export let dashboardStats = {
  todayRevenue: 2458.75,
  totalOrders: 142,
  avgOrderValue: 17.32,
  activeOrders: 5,
  recentOrders: [
    { id: "ORD-142", customer: "Emma Johnson", items: ["Latte", "Croissant"], total: 8.50, status: "completed", time: "10:45 AM" },
    { id: "ORD-141", customer: "Michael Chen", items: ["Cappuccino", "Blueberry Muffin"], total: 7.50, status: "preparing", time: "10:38 AM" },
    { id: "ORD-140", customer: "Sarah Wilson", items: ["Mocha", "Croissant"], total: 9.00, status: "ready", time: "10:30 AM" },
    { id: "ORD-139", customer: "David Park", items: ["Cold Brew"], total: 4.50, status: "completed", time: "10:25 AM" },
    { id: "ORD-138", customer: "Lisa Brown", items: ["Americano", "Croissant"], total: 7.00, status: "preparing", time: "10:18 AM" },
  ]
}

export const updateDashboard = (orderItems, total) => {
  dashboardStats.totalOrders += 1
  dashboardStats.todayRevenue += total
  dashboardStats.avgOrderValue = dashboardStats.todayRevenue / dashboardStats.totalOrders
  if (dashboardStats.activeOrders < 10) {
    dashboardStats.activeOrders += 1
  }
  
  const itemNames = orderItems.map(p => p.item.name)
  const newOrder = {
    id: `ORD-${dashboardStats.totalOrders}`,
    customer: "AI Customer",
    items: itemNames,
    total: parseFloat(total.toFixed(2)),
    status: "preparing",
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  dashboardStats.recentOrders.unshift(newOrder)
  if (dashboardStats.recentOrders.length > 5) {
    dashboardStats.recentOrders = dashboardStats.recentOrders.slice(0, 5)
  }
}
