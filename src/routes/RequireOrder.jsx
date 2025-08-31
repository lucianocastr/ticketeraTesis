// src/routes/RequireOrder.jsx
import { hasFreshOrder } from "../lib/order.js";
import { Navigate } from "react-router-dom";

export default function RequireOrder({ children }) {
  if (!hasFreshOrder(10)) return <Navigate to="/catalogo" replace />;
  return children;
}
