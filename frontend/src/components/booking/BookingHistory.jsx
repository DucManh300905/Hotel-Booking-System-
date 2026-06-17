import { useMyBookings } from "../../hooks/useBooking";
import BookingCard from "./BookingCard";
import Loading from "../common/Loading";

export default function BookingHistory() {
  const { bookings, loading, error } = useMyBookings();

  if (loading) return <Loading />;

  if (error) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "#c0392b", fontSize: 14 }}>
      ✕ {error}
    </div>
  );

  if (bookings.length === 0) return (
    <div style={{ textAlign: "center", padding: "5rem 2rem", color: "rgba(12,15,20,.35)" }}>
      <div style={{ fontSize: "3rem", marginBottom: 12, opacity: .4 }}>📋</div>
      <p>Bạn chưa có đặt chỗ nào.</p>
    </div>
  );

  const pending   = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Tất cả",     val: bookings.length, color: "#0c0f14" },
          { label: "Chờ xác nhận", val: pending,       color: "#8a6a18" },
          { label: "Đã xác nhận", val: confirmed,      color: "#2d7a5f" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", border: "1.5px solid rgba(12,15,20,.07)",
            borderRadius: 10, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, color: "rgba(12,15,20,.5)",
          }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.val}</span>
            {s.label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bookings.map((b, i) => (
          <BookingCard key={b._id} booking={b} index={i} />
        ))}
      </div>
    </div>
  );
}
