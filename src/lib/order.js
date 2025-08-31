// src/lib/order.js
import { readCart, clearCart } from "./cart";
import { hasSufficientStock, discountStock } from "./products";

const ORDER_KEY = "lastOrder";
const IDEMPOTENCY_KEYS = new Map();

/** Crea y persiste la última orden + timestamp */
export function createOrder({ nombre, email, dni }) {
  const items = readCart();
  if (!items.length) throw new Error("El carrito está vacío");

  const total = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);

  const order = { 
    id: Date.now().toString(), // mock simple
    nombre,
    email,
    dni,
    items,
    total,
    createdAt: new Date().toISOString(), // 👈 timestamp para validar “frescura”,
    status: "created",
    paymentId: null
};

  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  clearCart(); // vaciar carrito al comprar
  return order;
}

export function readLastOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY));
  } catch {
    return null;
  }
}

/** Borra la última orden (útil al salir de confirmación) */
export function clearLastOrder() {
  localStorage.removeItem(ORDER_KEY);
}

/** ¿Existe una orden y es reciente? (por defecto, 10 minutos) */
export function hasFreshOrder(maxMinutes = 10) {
  const o = readLastOrder();
  if (!o || !o.createdAt) return false;
  const ageMs = Date.now() - new Date(o.createdAt).getTime();
  return ageMs <= maxMinutes * 60 * 1000;
}

export function setOrderPaid(orderId, paymentId) {
  const o = readLastOrder();
  if (!o || o.id !== orderId) return readLastOrder();
  if (!o.paymentId) {
    o.paymentId = paymentId;
    o.status = "paid";
    discountStock(o.items);
    localStorage.setItem(ORDER_KEY, JSON.stringify(o));
  }
  IDEMPOTENCY_KEYS.set(orderId, o.paymentId);
  return o;
}

export function getOrCreatePaymentId(orderId) {
  if (IDEMPOTENCY_KEYS.has(orderId)) return IDEMPOTENCY_KEYS.get(orderId);
  const pid = "pay_" + orderId;
  IDEMPOTENCY_KEYS.set(orderId, pid);
  return pid;
}

export function validateStockForOrder(orderId) {
  const o = readLastOrder();
  if (!o || o.id !== orderId) throw new Error("Orden inexistente");
  if (!hasSufficientStock(o.items)) throw new Error("stock_insuficiente");
  return true;
}
