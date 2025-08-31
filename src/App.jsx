import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmacion from "./pages/Confirmacion.jsx";

import RequireAuth from "./routes/RequireAuth.jsx";
import RequireCart from "./routes/RequireCart.jsx";
import RequireOrder from "./routes/RequireOrder.jsx";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />

          <Route
            path="/carrito"
            element={
              <RequireAuth>
                <Carrito />
              </RequireAuth>
            }
          />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <RequireCart>
                  <Checkout />
                </RequireCart>
              </RequireAuth>
            }
          />

          <Route
            path="/confirmacion"
            element={
              <RequireOrder>
                <Confirmacion />
              </RequireOrder>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}
