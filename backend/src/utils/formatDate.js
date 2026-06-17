/**
 * Format Date → "DD/MM/YYYY" (vi-VN)
 */
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
 
/**
 * Format Date → "HH:mm DD/MM/YYYY"
 */
function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
 
module.exports = { formatDate, formatDateTime };