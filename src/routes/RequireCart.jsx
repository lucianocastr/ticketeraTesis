import { readCart } from "../lib/cart";
import { Navigate } from "react-router-dom";

export default function RequireCart({ children }) {
  const hasItems = (readCart().length > 0);
  if (!hasItems) return <Navigate to="/catalogo" replace />;
  return children;
}
