import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al sistema de Ticketera</h1>
      <p className="text-gray-300 mb-6 max-w-lg">
        Este mini-sitio fue desarrollado como parte de un <strong>Proyecto de Grado</strong> en
        Ingeniería de Sistemas. Simula un flujo completo de compra de entradas con Login, Catálogo, Carrito, Checkout y Confirmación.
      </p>
      <a href={`${import.meta.env.BASE_URL}catalogo`} className="...">Comenzar</a>

    </div>
  );
}
