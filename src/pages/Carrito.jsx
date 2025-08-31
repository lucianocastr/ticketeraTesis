import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readCart, clearCart } from "../lib/cart";
import { formatARS } from "../lib/format";
import { isLoggedIn } from "../lib/session";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6">
      <h1 data-testid="carrito-page" className="text-2xl font-bold mb-4 text-center">
        Carrito de compras
      </h1>

      {items.length === 0 ? (
        <p data-testid="carrito-vacio" className="text-center text-gray-400">
          Tu carrito está vacío
        </p>
      ) : (
        <>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-gray-400 border-b border-neutral-700">
                <th className="py-2">Producto</th>
                <th className="py-2">Cant.</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody data-testid="carrito-lista">
              {items.map((it) => (
                <tr key={it.id} data-testid={`carrito-item-${it.id}`} className="border-b border-neutral-800">
                  <td className="py-2">{it.nombre}</td>
                  <td className="py-2">{it.cantidad}</td>
                  <td className="py-2 text-right">{formatARS(it.precio * it.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p data-testid="carrito-total" className="font-semibold text-right mb-4">
            Total: {formatARS(total)}
          </p>

          <div className="flex justify-between">
            <button
              data-testid="carrito-limpiar"
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Vaciar carrito
            </button>

            <Link
              to="/checkout"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Ir a checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
