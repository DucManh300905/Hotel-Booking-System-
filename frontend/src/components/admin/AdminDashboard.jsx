import { useAllBookings } from "../../hooks/useBooking";
import { useState, useEffect } from "react";
import roomApi from "../../api/roomApi";
import Loading from "../common/Loading";
import AdminBookings from "./AdminBookings";
import { fmtPrice } from "../../utils/calculateNights";

function StatCard({ icon, label, val, hint, index, accent }) {
  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${accent ? "rgba(184,146,42,.25)" : "rgba(12,15,20,.07)"}`,
      borderRadius: 14, padding: "1.5rem",
      boxShadow: accent ? "0 4px 20px rgba(184,146,42,.1)" : "0 4px 16px rgba(0,0,0,.05)",
      animation: `slideUp .3s ease ${index * 0.06}s both`,
    }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(12,15,20,.4)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 600, color: accent ? "#b8922a" : "#0c0f14" }}>
        {val}
      </div>
      <div style={{ fontSize: 12, color: "rgba(12,15,20,.35)", marginTop: 4 }}>{hint}</div>
    </div>
  );
}

export default function AdminDashboard({ showToast }) {
  const { bookings, loading } = useAllBookings();
  const [rooms, setRooms]     = useState([]);

  useEffect(() => {
    roomApi.getAll().then(setRooms).catch(console.error);
  }, []);

  if (loading) return <Loading />;

  const confirmed    = bookings.filter(b => b.status === "confirmed").length;
  const pending      = bookings.filter(b => b.status === "pending").length;
  const cancelled    = bookings.filter(b => b.status === "cancelled").length;
  const depositPaid  = bookings.filter(b => b.paymentStatus === "deposit_paid").length;
  const revenue      = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((s, b) => s + (b.totalPrice || 0), 0);
  const depositTotal = bookings
    .filter(b => b.paymentStatus === "deposit_paid" || b.paymentStatus === "fully_paid")
    .reduce((s, b) => s + (b.depositAmount || 0), 0);

  const stats = [
    { icon: "🏨", label: "Tổng phòng",      val: rooms.length,        hint: "Đang hoạt động",                   accent: false },
    { icon: "⏳", label: "Chờ xác nhận",    val: pending,             hint: "Cần xử lý ngay",                   accent: pending > 0 },
    { icon: "✅", label: "Đã xác nhận",     val: confirmed,           hint: `${cancelled} đã hủy`,              accent: false },
    { icon: "💳", label: "Đã nhận cọc",     val: depositPaid,         hint: `${fmtPrice(depositTotal)} VND`,    accent: false },
    { icon: "💰", label: "Doanh thu dự kiến", val: fmtPrice(revenue), hint: "VND (chưa tính hủy)",              accent: false },
  ];

  return (
    <div>
      {/* Pending alert */}
      {pending > 0 && (
        <div style={{
          background: "rgba(184,146,42,.08)", border: "1px solid rgba(184,146,42,.3)",
          borderRadius: 12, padding: "12px 18px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 14, color: "#8a6a18", fontWeight: 500,
        }}>
          ⚠️ Có <strong>{pending}</strong> booking đang chờ xác nhận thanh toán cọc
        </div>
      )}

      {/* Stats grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
        gap: "1rem", marginBottom: "2.5rem",
      }}>
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Bookings */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 400, color: "#0c0f14" }}>
          Tất cả đặt phòng
        </h2>
        <span style={{ fontSize: 12, color: "rgba(12,15,20,.4)" }}>
          🔒 Thông tin khách được mã hóa AES-256
        </span>
      </div>

      <AdminBookings showToast={showToast} />
    </div>
  );
}
