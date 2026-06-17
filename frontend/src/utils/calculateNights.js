export function calculateNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.ceil(diff / 86400000));
}
 
export function fmtPrice(n) {
  return Number(n).toLocaleString("vi-VN");
}   