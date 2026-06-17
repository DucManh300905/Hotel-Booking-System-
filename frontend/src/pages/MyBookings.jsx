import BookingHistory from "../components/booking/BookingHistory";

export default function MyBookings() {
  return (
    <div style={{ padding: "2.5rem", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", animation: "fadeIn .35s ease" }}>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "2rem",
          fontWeight: 400, color: "#0c0f14", marginBottom: 6,
        }}>
          Đặt chỗ của tôi
        </h1>
        <p style={{ color: "rgba(12,15,20,.45)", fontSize: 13 }}>
          Lịch sử đặt phòng cá nhân
        </p>
        <div style={{
          width: 56, height: 2,
          background: "linear-gradient(90deg,#b8922a,transparent)",
          marginTop: 12,
        }} />
      </div>
      <BookingHistory />
    </div>
  );
}
