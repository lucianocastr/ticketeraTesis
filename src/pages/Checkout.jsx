import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";


import { createOrder } from "../lib/order";

import { readCart } from "../lib/cart";
import {
  normalizeCard,
  luhn,
  isValidExpiry,
  isValidCvc,
  last4,
} from "../lib/card";
import { payments } from "../lib/payments";

// Formateador ARS local (evita dependencias)
const fmtARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    Number(n || 0)
  );

export default function Checkout() {
  const navigate = useNavigate();

  // ------- Carrito / Totales -------
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + Number(it?.precio || 0) * Number(it?.cantidad || 0),
        0
      ),
    [items]
  );

  // ------- Datos del comprador -------
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");

  const nombreOk = nombre.trim().length >= 2;
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const dniOk = /^\d{6,12}$/.test(dni);

  // ------- Pago (simulado) -------
  const [card, setCard] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [cvc, setCvc] = useState("");

  const cardOk = useMemo(() => luhn(card), [card]);
  const expOk = useMemo(() => isValidExpiry(exp), [exp]);
  const cvcOk = useMemo(() => isValidCvc(cvc), [cvc]);

  // ------- UI estado -------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formOk =
    items.length > 0 &&
    nombreOk &&
    emailOk &&
    dniOk &&
    cardOk &&
    expOk &&
    cvcOk;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formOk || loading) return;

    setLoading(true);
    setError("");

    try {
  const token = last4(card);

  // Hook para tests: si window.__TEST_PAY__.charge existe, úsalo; si no, usa payments.charge normal
  const payFn =
    typeof window !== "undefined" && window.__TEST_PAY__?.charge
      ? window.__TEST_PAY__.charge
      : payments.charge;

  const res = await payFn({
    amount: total,
    email,
    token,
    name: nombre,
    dni,
  });

  if (res.status === "approved") {
    createOrder({ nombre, email, dni });
    navigate("/confirmacion");
    return;
  } else {
    setError(
      "Pago rechazado" +
        (res.reason ? ` (${res.reason.replaceAll("_", " ")})` : "") +
        ". Probá otra tarjeta."
    );
  }
} catch (err) {
  setError(
    "Error técnico al procesar el pago. Verificá tu conexión e intentá nuevamente."
  );
} finally {
  setLoading(false);
}

  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb/nav mínimo */}
      <nav className="text-sm text-neutral-400 mb-4">
        <Link to="/catalogo" className="hover:underline">
          Catálogo
        </Link>{" "}
        / <span className="text-neutral-200">Checkout</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ------- Resumen de compra ------- */}
        <aside className="bg-neutral-800 border border-neutral-700 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">Resumen</h3>

          {items.length === 0 ? (
            <p className="text-neutral-400">
              Tu carrito está vacío.{" "}
              <Link to="/catalogo" className="text-blue-400 hover:underline">
                Volver al catálogo
              </Link>
            </p>
          ) : (
            <>
              <ul className="space-y-2 mb-3">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="flex justify-between text-sm text-neutral-300"
                  >
                    <span>
                      {it.nombre} × {it.cantidad}
                    </span>
                    <span>
                      {fmtARS(Number(it.precio) * Number(it.cantidad))}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-neutral-700 pt-2 font-medium">
                <span>Total</span>
                <span>{fmtARS(total)}</span>
              </div>
            </>
          )}
        </aside>

        {/* ------- Formulario ------- */}
        <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h2 className="text-center text-xl font-semibold mb-4">Checkout</h2>

          <form data-testid="checkout-form" onSubmit={onSubmit} className="space-y-4">
            {/* Comprador */}
            <div>
              <label className="text-sm text-neutral-300">Nombre</label>
              <input
                className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                data-testid="inp-nombre"
              />
              {!nombreOk && (
                <p className="text-xs text-red-400 mt-1">
                  Ingrese un nombre válido.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-neutral-300">Email</label>
              <input
                className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="inp-email"
              />
              {!emailOk && (
                <p className="text-xs text-red-400 mt-1">Email inválido.</p>
              )}
            </div>

            <div>
              <label className="text-sm text-neutral-300">DNI</label>
              <input
                className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                data-testid="inp-dni"
              />
              {!dniOk && (
                <p className="text-xs text-red-400 mt-1">DNI inválido.</p>
              )}
            </div>

            {/* Pago simulado */}
            <div className="pt-3 border-t border-neutral-700">
              <p className="text-neutral-300 text-sm mb-2">
                Datos de pago (simulado)
              </p>

              <div>
                <label className="text-sm text-neutral-300">
                  Número de tarjeta
                </label>
                <input
                  className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 tracking-widest"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={card}
                  onChange={(e) => setCard(normalizeCard(e.target.value))}
                  data-testid="inp-card"
                />
                {card && !cardOk && (
                  <p className="text-xs text-red-400 mt-1">
                    Número inválido (Luhn).
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-neutral-300">
                    Vencimiento (MM/YY)
                  </label>
                  <input
                    className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                    placeholder="12/28"
                    value={exp}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                      setExp(v);
                    }}
                    data-testid="inp-exp"
                  />
                  {exp && !expOk && (
                    <p className="text-xs text-red-400 mt-1">
                      Fecha inválida o vencida.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-neutral-300">CVC</label>
                  <input
                    className="w-full mt-1 rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    data-testid="inp-cvc"
                  />
                  {cvc && !cvcOk && (
                    <p className="text-xs text-red-400 mt-1">CVC inválido.</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit" data-testid="btn-pay"
              disabled={!formOk || loading}
              className={`w-full mt-2 rounded-md px-4 py-2 font-medium ${
                formOk && !loading
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-neutral-700 cursor-not-allowed"
              }`}
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>

            {error && (
              <p className="text-sm text-red-400 mt-2" role="alert">
                {error}
              </p>
            )}
          </form>

          {items.length > 0 && (
            <p className="text-[11px] text-neutral-500 mt-3">
              * Este formulario simula un pago para fines académicos. No se
              almacenan datos sensibles.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
