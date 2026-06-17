export function maskIdNumber(id) {
  if (!id || id.length <= 4) return id;
  return "*".repeat(id.length - 4) + id.slice(-4);
}
 
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
 