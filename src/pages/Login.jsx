import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import usuarios from "../data/usuarios.json";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [step, setStep] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef([]);

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

  const handleSendCode = (e) => {
    e.preventDefault();
    setStep("forgot-loading");
    setTimeout(() => setStep("forgot-otp"), 2000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError("");
    if (otp.join("") === "123456") {
      const found = usuarios.find((u) => u.email === resetEmail.trim());
      localStorage.setItem(
        "sessionUser",
        JSON.stringify({
          email: resetEmail.trim(),
          nombre: found ? found.nombre : "Usuario",
        })
      );
      navigate("/catalogo");
    } else {
      setOtpError("Código inválido");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const goBack = () => {
    setStep("login");
    setResetEmail("");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  if (step === "forgot-loading") {
    return (
      <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div
            data-testid="spinner"
            className="animate-spin rounded-full h-10 w-10 border-4 border-neutral-600 border-t-blue-500"
          />
          <p className="text-neutral-300 text-sm">Enviando código...</p>
        </div>
      </div>
    );
  }

  if (step === "forgot-email") {
    return (
      <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Recuperar contraseña
        </h1>
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block mb-1 text-sm font-medium"
            >
              Ingresá tu email
            </label>
            <input
              id="reset-email"
              data-testid="input-reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            data-testid="btn-send-code"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow"
          >
            Enviar código
          </button>
          <button
            type="button"
            data-testid="btn-back"
            onClick={goBack}
            className="w-full text-neutral-400 hover:text-white text-sm py-1"
          >
            Volver al login
          </button>
        </form>
      </div>
    );
  }

  if (step === "forgot-otp") {
    return (
      <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verificar código
        </h1>
        <p className="text-neutral-400 text-sm text-center mb-4">
          Ingresá el código enviado a {resetEmail}
        </p>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                data-testid={`input-otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
                className="w-12 h-12 text-center text-xl border border-neutral-600 rounded-md bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {otpError && (
            <p data-testid="otp-error" className="text-red-400 text-sm">
              {otpError}
            </p>
          )}
          <button
            type="submit"
            data-testid="btn-verify-otp"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow"
          >
            Verificar
          </button>
          <button
            type="button"
            data-testid="btn-back"
            onClick={goBack}
            className="w-full text-neutral-400 hover:text-white text-sm py-1"
          >
            Volver al login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow p-6 login-container">
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

      <button
        type="button"
        data-testid="btn-forgot-password"
        onClick={() => setStep("forgot-email")}
        className="w-full text-neutral-400 hover:text-white text-sm mt-3 py-1 btn-light"
      >
        Olvidé mi contraseña
      </button>
    </div>
  );
}
