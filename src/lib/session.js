const KEY = "sessionUser";
const TTL_MINUTES = 20;

export function getSessionUser() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function isLoggedIn() { return !!getSessionUser(); }
export function logout() { localStorage.removeItem(KEY); }
export function login(user) {
  const now = Date.now();
  const payload = { ...user, loginAt: now };
  localStorage.setItem(KEY, JSON.stringify(payload));
  return payload;
}
export function isExpired() {
  const u = getSessionUser();
  if (!u?.loginAt) return true;
  const age = Date.now() - Number(u.loginAt);
  return age > TTL_MINUTES * 60 * 1000;
}
