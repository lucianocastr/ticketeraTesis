import { useState } from "react";
import { addToCart } from "../lib/cart";
import { products } from "../lib/products";
import { formatARS } from "../lib/format";

export default function Catalogo() {
  const [toast, setToast] = useState(null);

  const handleAdd = (p) => {
    addToCart(p);
    // avisito de éxito
    setToast(`${p.nombre} agregado al carrito`);
    // notificar a layout si escucha "cart:updated"
    window.dispatchEvent(new Event("cart:updated"));
    // ocultar toast
    setTimeout(() => setToast(null), 1400);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="text-neutral-400 text-sm">
          Seleccioná los productos y agregalos al carrito.
        </p>
      </header>

      {/* Toast simple */}
      {toast && (
        <div
          className="mb-4 rounded-md border border-emerald-700 bg-emerald-600/10 px-4 py-2 text-emerald-300"
          role="status"
          data-testid="toast-added"
        >
          {toast}
        </div>
      )}

      {/* Grid de cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden flex flex-col"
            data-testid={`card-${p.id}`}
          >
            {/* Imagen */}
            <div className="w-full h-40 bg-neutral-900">
              <img
                src={p.imagen || `https://picsum.photos/seed/${p.id}/600/400`}
                alt={p.nombre}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Cuerpo */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-medium">{p.nombre}</h3>
              <p className="text-neutral-400 mt-1">{formatARS(p.precio)}</p>

              {/* Acciones */}
              <div className="mt-auto pt-3">
                <button
                  onClick={() => handleAdd(p)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md"
                  data-testid={`btn-add-${p.id}`}
                >
                  <span data-testid="btn-add-to-cart">Agregar al carrito</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Fallback cuando no hay productos */}
      {products.length === 0 && (
        <div className="mt-10 text-center text-neutral-400">
          No hay productos disponibles por el momento.
        </div>
      )}
    </div>
  );
}
