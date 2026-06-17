const bookingMap = {
  confirmed: { label: "Đã xác nhận", bg: "rgba(45,120,85,.1)",   border: "rgba(45,120,85,.25)",  color: "#2d7a5f" },
  pending:   { label: "Chờ xác nhận", bg: "rgba(184,146,42,.1)", border: "rgba(184,146,42,.3)",  color: "#8a6a18" },
  cancelled: { label: "Đã hủy",       bg: "rgba(192,57,43,.08)", border: "rgba(192,57,43,.2)",   color: "#c0392b" },
};

const paymentMap = {
  pending:      { label: "Chưa cọc",     bg: "rgba(192,57,43,.07)", border: "rgba(192,57,43,.2)",   color: "#c0392b" },
  deposit_paid: { label: "Đã cọc 50%",   bg: "rgba(45,120,85,.1)",  border: "rgba(45,120,85,.25)",  color: "#2d7a5f" },
  fully_paid:   { label: "Thanh toán đủ", bg: "rgba(45,120,85,.15)", border: "rgba(45,120,85,.3)",   color: "#1a5c40" },
  failed:       { label: "Thất bại",      bg: "rgba(192,57,43,.08)", border: "rgba(192,57,43,.2)",   color: "#c0392b" },
  refunded:     { label: "Đã hoàn tiền",  bg: "rgba(43,74,122,.08)", border: "rgba(43,74,122,.2)",   color: "#2b4a7a" },
};

export default function StatusBadge({ status, type = "booking" }) {
  const map = type === "payment" ? paymentMap : bookingMap;
  const c   = map[status] || bookingMap.pending;
  return (
    <span style={{
      fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
      padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 500,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      {c.label}
    </span>
  );
}
