import { PaymentsAdapter } from "./adapter";

// Reglas simples para demo:
// token "4242" => aprobado
// token "4000" => rechazado (fondos)
// cualquier otro => error de red aleatorio (10%)
export class FakePayments extends PaymentsAdapter {
  async charge({ amount, email, token, name }) {
    // efecto de “procesando”
    await new Promise(r => setTimeout(r, 800));

    if (token === "4242") {
      return { status: "approved", authCode: "OK" + String(amount).slice(-3) };
    }
    if (token === "4000") {
      return { status: "declined", reason: "insufficient_funds" };
    }
    // pequeña probabilidad de error “técnico”
    if (Math.random() < 0.10) {
      throw Object.assign(new Error("network_error"), { code: "ETIMEDOUT" });
    }
    // por defecto, aprobado
    return { status: "approved", authCode: "OKA" + (name?.length ?? 3) };
  }
}
