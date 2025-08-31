import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarios from "../data/usuarios.json";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const found = usuarios.find(
      (u) => u.email === email.trim() && u.password === password
    );
    if (found) {
      localStorage.setItem(
        "sessionUser",
        JSON.stringify({ email: found.email, nombre: found.nombre })
      );
      navigate("/catalogo");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <form data-testid="login-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            data-testid="input-email"
            type="email" name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            data-testid="input-password"
            type="password" name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <p data-testid="login-error" className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit" data-testid="btn-login"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
