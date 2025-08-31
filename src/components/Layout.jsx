import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { readCart } from "../lib/cart";
import { isLoggedIn, logout } from "../lib/session";

export default function Layout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [logged, setLogged] = useState(isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setCartCount(readCart().reduce((a, it) => a + it.cantidad, 0));
    update();
    window.addEventListener("cart:updated", update);
    return () => window.removeEventListener("cart:updated", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setLogged(isLoggedIn()), 500); // chequeo liviano
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
      <header className="bg-gray-800/80 backdrop-blur border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Proyecto de Grado • Mini Ticketera</h1>

          <nav className="text-sm sm:text-base flex gap-4 items-center">
            <Link to="/catalogo" className="hover:underline">Catálogo</Link>

            {logged && (
              <>
                <Link to="/carrito" className="relative hover:underline">
                  Carrito
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/checkout" className="hover:underline">Checkout</Link>
                <Link to="/confirmacion" className="hover:underline">Confirmación</Link>
                <button onClick={handleLogout} className="hover:underline text-gray-300">Salir</button>
              </>
            )}

            {!logged && <Link to="/login" className="hover:underline">Login</Link>}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6">{children}</main>

      <footer className="mt-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 text-xs text-gray-400 text-center">
          Desarrollado para <strong>Proyecto de Grado – Ingeniería de Sistemas</strong> · 2025
        </div>
      </footer>
    </div>
  );
}
