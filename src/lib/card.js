// src/lib/card.js
export function normalizeCard(value = "") {
  // deja solo dígitos y espacia en grupos de 4: "4242 4242 4242 4242"
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function luhn(cardNumber = "") {
  // valida Luhn (sumatoria módulo 10)
  const digits = cardNumber.replace(/\s+/g, "");
  if (digits.length < 13) return false;
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(mmYY = "") {
  // formato MM/YY y fecha no vencida
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const [mmS, yyS] = mmYY.split("/");
  const mm = parseInt(mmS, 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const year2000 = 2000 + parseInt(yyS, 10);
  // último día del mes (23:59)
  const expires = new Date(year2000, mm, 0, 23, 59, 59);
  return expires >= now;
}

export function isValidCvc(cvc = "") {
  return /^\d{3,4}$/.test(cvc);
}

export function last4(cardNumber = "") {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.slice(-4);
}
