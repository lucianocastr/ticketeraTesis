const KEY = "cartItems";

/** Utilidades base */
export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function writeCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  // 🔔 Notificamos a la app que el carrito cambió
  try {
    window.dispatchEvent(new CustomEvent("cart:updated"));
  } catch {
    // no-op (SSR/tests)
  }
}

/** Operaciones */
export function addToCart(item) {
  const current = readCart();
  const existing = current.find((i) => i.id === item.id);
  if (existing) {
    existing.cantidad += 1;
  } else {
    current.push({ ...item, cantidad: 1 });
  }
  writeCart(current);
  return current;
}

export function clearCart() {
  writeCart([]);
}
