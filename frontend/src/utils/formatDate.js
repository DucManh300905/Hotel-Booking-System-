export function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}
 
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
 
export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
 
export function minCheckout(checkIn) {
  if (!checkIn) return tomorrowISO();
  const d = new Date(checkIn);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}