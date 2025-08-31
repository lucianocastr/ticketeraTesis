import { FakePayments } from "./fake";

// En el futuro podés agregar un SandboxAdapter real y cambiar por env var.
const mode = (import.meta.env.VITE_PAYMENTS || "fake").toLowerCase();

let adapter;
switch (mode) {
  case "fake":
  default:
    adapter = new FakePayments();
}

export const payments = adapter;
