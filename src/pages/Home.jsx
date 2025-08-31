import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al sistema de Ticketera</h1>
      <p className="text-gray-300 mb-6 max-w-lg">
        Este mini-sitio fue desarrollado como parte de un <strong>Proyecto de Grado</strong> en
        Ingeniería de Sistemas. Simula un flujo completo de compra de entradas con Login, Catálogo, Carrito, Checkout y Confirmación.
      </p>
      <Link
        to="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition"
      >
        Comenzar
      </Link>
    </div>
  );
}
