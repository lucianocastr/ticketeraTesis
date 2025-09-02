// src/lib/products.js
// src/lib/products.js
import generalPng from '../assets/general.png';
import vipJpg     from '../assets/ticketVIP.jpg';
import famPng    from '../assets/ticketFamiliar.png';

export const products = [
  { id: 1, nombre: "Entrada General", precio: 5000,  imagen: generalPng, stock: 50 },
  { id: 2, nombre: "Entrada VIP",     precio: 12000, imagen: vipJpg,     stock: 20 },
  { id: 3, nombre: "Pack Familiar",   precio: 20000, imagen: famPng,      stock: 10 },
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
