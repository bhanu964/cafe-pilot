export const menuItems = [
  { id: 1, name: "Espresso", price: 3.50, category: "coffee", keywords: ["espresso", "shot"] },
  { id: 2, name: "Americano", price: 4.00, category: "coffee", keywords: ["americano", "black coffee"] },
  { id: 3, name: "Latte", price: 5.00, category: "coffee", keywords: ["latte", "milk coffee"] },
  { id: 4, name: "Cappuccino", price: 4.75, category: "coffee", keywords: ["cappuccino"] },
  { id: 5, name: "Mocha", price: 5.25, category: "coffee", keywords: ["mocha", "chocolate coffee"] },
  { id: 6, name: "Cold Brew", price: 4.75, category: "coffee", keywords: ["cold brew", "cold coffee", "iced coffee"] },
  { id: 7, name: "Cold Coffee", price: 4.75, category: "coffee", keywords: ["cold coffee", "iced coffee"] },
  { id: 8, name: "Croissant", price: 3.50, category: "pastry", keywords: ["croissant", "buttery pastry"] },
  { id: 9, name: "Blueberry Muffin", price: 3.75, category: "pastry", keywords: ["blueberry muffin", "muffin"] },
  { id: 10, name: "Chocolate Chip Cookie", price: 2.75, category: "pastry", keywords: ["cookie", "chocolate cookie"] },
  { id: 11, name: "Cheese Sandwich", price: 6.50, category: "food", keywords: ["cheese sandwich", "sandwich"] },
  { id: 12, name: "Ham Sandwich", price: 7.50, category: "food", keywords: ["ham sandwich", "sandwich"] },
  { id: 13, name: "Grilled Cheese", price: 6.75, category: "food", keywords: ["grilled cheese"] },
  { id: 14, name: "Avocado Toast", price: 8.00, category: "food", keywords: ["avocado toast", "toast"] },
  { id: 15, name: "Green Tea", price: 3.25, category: "tea", keywords: ["green tea", "tea"] },
  { id: 16, name: "Black Tea", price: 3.25, category: "tea", keywords: ["black tea", "tea"] },
]

export const findMenuItem = (text) => {
  const lowerText = text.toLowerCase()
  for (const item of menuItems) {
    if (item.keywords.some(keyword => lowerText.includes(keyword))) {
      return item
    }
  }
  return null
}
