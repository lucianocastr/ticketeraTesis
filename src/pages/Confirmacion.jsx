// src/pages/Confirmacion.jsx
import { readLastOrder, hasFreshOrder, clearLastOrder } from "../lib/order";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { formatARS } from "../lib/format";

export default function Confirmacion() {
  const navigate = useNavigate();
  const order = readLastOrder();

  // Si no hay orden “fresca”, redirigimos al catálogo
  useEffect(() => {
    if (!hasFreshOrder(10)) navigate("/catalogo", { replace: true });
  }, [navigate]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-600 text-yellow-300 rounded-md p-4">
          <p data-testid="confirmacion-sin-orden" className="font-medium">
            No hay una orden reciente.
          </p>
          <p className="text-sm opacity-80">
            Volvé al catálogo para iniciar una nueva compra.
          </p>
        </div>

        <Link
          to="/catalogo"
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tarjeta de éxito */}
      <div className="bg-emerald-600/10 border border-emerald-600 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="shrink-0 h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-emerald-300">¡Compra confirmada!</h2>
          <p className="text-sm text-emerald-200/80">
            Tu orden fue registrada correctamente. Abajo están los detalles.
          </p>
        </div>
      </div>

      {/* Detalle de orden */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow">
        <div className="px-5 py-4 border-b border-neutral-700">
          <h1 data-testid="confirmacion-page" className="text-xl font-semibold">
            Resumen de la orden
          </h1>
          <p className="text-sm text-neutral-400 mt-1" data-testid="orden-id">
            Orden: <span className="font-mono">{order.id}</span>
          </p>
        </div>

        <div className="px-5 py-4 grid gap-3 sm:grid-cols-2">
          <p data-testid="orden-nombre"><span className="text-neutral-400">Nombre:</span> <strong>{order.nombre}</strong></p>
          <p data-testid="orden-email"><span className="text-neutral-400">Email:</span> {order.email}</p>
          <p className="sm:col-span-2" data-testid="orden-total">
            <span className="text-neutral-400">Total:</span>{" "}
            <strong>{formatARS(order.total)}</strong>
          </p>
        </div>

        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold text-neutral-300 mb-2">Ítems</h3>
          <ul data-testid="orden-items" className="divide-y divide-neutral-700">
            {order.items.map((it) => (
              <li key={it.id} className="py-2 flex justify-between">
                <span>
                  {it.nombre} × {it.cantidad}
                </span>
                <span className="font-medium">
                  {formatARS(it.precio * it.cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-3">
            <Link
              to="/catalogo"
              data-testid="btn-volver"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
              onClick={() => clearLastOrder()}  // 👈 limpiar orden al salir
            >
              Volver al catálogo
            </Link>
            <Link
              to="/checkout"
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-md"
              onClick={() => clearLastOrder()}  // 👈 limpiar orden al salir
            >
              Nueva compra
            </Link>
          </div>

          <p className="text-xs text-neutral-500 mt-3">
            Esta confirmación estará disponible por 10 minutos después de la compra.
          </p>
        </div>
      </div>
    </div>
  );
}
