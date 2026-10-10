export const todayOrders = [
  { id: "ORD-142", customer: "Emma Johnson", items: ["Latte", "Croissant"], quantity: 2, total: 8.50, status: "completed", time: "10:45 AM", paymentMethod: "Card" },
  { id: "ORD-141", customer: "Michael Chen", items: ["Cappuccino", "Blueberry Muffin"], quantity: 2, total: 7.50, status: "preparing", time: "10:38 AM", paymentMethod: "Cash" },
  { id: "ORD-140", customer: "Sarah Wilson", items: ["Mocha", "Croissant"], quantity: 2, total: 9.00, status: "ready", time: "10:30 AM", paymentMethod: "Card" },
  { id: "ORD-139", customer: "David Park", items: ["Cold Brew"], quantity: 1, total: 4.50, status: "completed", time: "10:25 AM", paymentMethod: "Mobile" },
  { id: "ORD-138", customer: "Lisa Brown", items: ["Americano", "Croissant"], quantity: 2, total: 7.00, status: "preparing", time: "10:18 AM", paymentMethod: "Card" },
  { id: "ORD-137", customer: "Alex Rodriguez", items: ["Cold Coffee", "Cheese Sandwich"], quantity: 2, total: 11.25, status: "completed", time: "10:05 AM", paymentMethod: "Card" },
  { id: "ORD-136", customer: "Jamie Lee", items: ["Latte"], quantity: 1, total: 5.00, status: "completed", time: "09:52 AM", paymentMethod: "Cash" },
  { id: "ORD-135", customer: "Taylor Swift", items: ["Cappuccino", "Chocolate Chip Cookie"], quantity: 2, total: 7.50, status: "completed", time: "09:40 AM", paymentMethod: "Card" },
]

export const todaysIncome = todayOrders.reduce((sum, order) => sum + order.total, 0)
