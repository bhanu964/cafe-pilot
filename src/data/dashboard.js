export const stats = {
  todayRevenue: 2458.75,
  totalOrders: 142,
  avgOrderValue: 17.32,
  activeOrders: 5,
}

export const popularItems = [
  { id: 1, name: "Cappuccino", orders: 48, revenue: 216.00 },
  { id: 2, name: "Latte", orders: 42, revenue: 210.00 },
  { id: 3, name: "Croissant", orders: 35, revenue: 122.50 },
  { id: 4, name: "Mocha", orders: 28, revenue: 154.00 },
  { id: 5, name: "Espresso", orders: 24, revenue: 60.00 },
]

export const lowStockItems = [
  { id: 1, name: "Blueberry Muffins", stock: 8, threshold: 15 },
  { id: 2, name: "Croissants", stock: 12, threshold: 20 },
  { id: 3, name: "Whole Milk", stock: 5, threshold: 15 },
  { id: 4, name: "Dark Chocolate", stock: 6, threshold: 10 },
]

export const recentOrders = [
  { id: "ORD-142", customer: "Emma Johnson", items: ["Latte", "Croissant"], total: 8.50, status: "completed", time: "10:45 AM" },
  { id: "ORD-141", customer: "Michael Chen", items: ["Cappuccino", "Blueberry Muffin"], total: 7.50, status: "preparing", time: "10:38 AM" },
  { id: "ORD-140", customer: "Sarah Wilson", items: ["Mocha", "Croissant"], total: 9.00, status: "ready", time: "10:30 AM" },
  { id: "ORD-139", customer: "David Park", items: ["Cold Brew"], total: 4.50, status: "completed", time: "10:25 AM" },
  { id: "ORD-138", customer: "Lisa Brown", items: ["Americano", "Croissant"], total: 7.00, status: "preparing", time: "10:18 AM" },
]

export const aiInsights = [
  { title: "Peak Time Prediction", description: "Lunch rush expected at 12:00 PM - Consider adding barista" },
  { title: "Inventory Alert", description: "Low stock on pastries - Reorder within 24 hours" },
  { title: "Sales Trend", description: "Cold Brew sales up 23% compared to yesterday" },
  { title: "Customer Preference", description: "Cappuccino most popular in morning hours" },
]
