// src/lib/products.js (ejemplo con stock)
export const products = [
  { id: 1, nombre: "Entrada General", precio: 5000, imagen: "/img/general.png", stock: 50 },
  { id: 2, nombre: "Entrada VIP", precio: 12000, imagen: "/img/ticketVIP.jpg", stock: 20 },
  { id: 3, nombre: "Pack Familiar", precio: 20000, imagen: "/img/ticketFamiliar.png", stock: 10 },
];

// Helpers de stock
export function getProductById(id) { return products.find(p => p.id === Number(id)); }
export function hasSufficientStock(items) {
  return items.every(it => {
    const p = getProductById(it.id);
    return p && (p.stock ?? 0) >= it.cantidad;
  });
}
export function discountStock(items) {
  items.forEach(it => {
    const p = getProductById(it.id);
    if (p) p.stock = Math.max(0, (p.stock ?? 0) - it.cantidad);
  });
}
