import StatusBadge from "../common/StatusBadge";
import { fmtDate } from "../../utils/formatDate";
import { fmtPrice, calculateNights } from "../../utils/calculateNights";

function InfoRow({ icon, label, val, highlight, green, strike }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:7 }}>
      <span style={{ fontSize:12, width:18, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:11, color:"rgba(12,15,20,.4)", width:76, flexShrink:0 }}>{label}</span>
      <span style={{
        fontSize:13, fontWeight: highlight ? 600 : 400,
        color: highlight ? "#b8922a" : green ? "#2d7a5f" : "#0c0f14",
        textDecoration: strike ? "line-through" : "none",
        opacity: strike ? 0.45 : 1,
      }}>{val}</span>
    </div>
  );
}

export default function BookingCard({ booking, index = 0 }) {
  const room        = booking.room && typeof booking.room === "object" ? booking.room : null;
  const nights      = booking.checkIn && booking.checkOut ? calculateNights(booking.checkIn, booking.checkOut) : null;
  const gi          = booking.guestInfo;
  const deposit     = booking.depositAmount || Math.ceil((booking.finalPrice || booking.totalPrice) / 2);
  const finalPrice  = booking.finalPrice || booking.totalPrice;
  const totalPrice  = booking.totalPrice || finalPrice;
  const hasDiscount = (booking.discountAmount || 0) > 0;
  const discount    = booking.discountAmount || 0;

  return (
    <div style={{
      background:"#fff", border:"1.5px solid rgba(12,15,20,.07)",
      borderRadius:16, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.05)",
      animation:`slideUp .3s ease ${index * 0.05}s both`,
    }}>
      {/* Top bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 20px", borderBottom:"1px solid rgba(12,15,20,.06)",
        background:"rgba(12,15,20,.015)", flexWrap:"wrap", gap:8,
      }}>
        <div>
          <div style={{ fontWeight:600, fontSize:15, color:"#0c0f14" }}>
            {room?.name || `Phòng #${String(booking._id).slice(-6).toUpperCase()}`}
          </div>
          <div style={{ fontSize:11, color:"rgba(12,15,20,.28)", fontFamily:"monospace", marginTop:2 }}>
            #{String(booking._id).slice(-8).toUpperCase()}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <StatusBadge status={booking.status} type="booking" />
          <StatusBadge status={booking.paymentStatus || "pending"} type="payment" />
        </div>
      </div>

      {/* Content */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
        {/* Booking info */}
        <div style={{ padding:"16px 20px", borderRight:"1px solid rgba(12,15,20,.06)" }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.35)", marginBottom:10, fontWeight:500 }}>
            Thông tin đặt phòng
          </div>
          <InfoRow icon="📅" label="Nhận phòng" val={fmtDate(booking.checkIn)} />
          <InfoRow icon="📅" label="Trả phòng"  val={fmtDate(booking.checkOut)} />
          {nights && <InfoRow icon="🌙" label="Số đêm" val={`${nights} đêm`} />}

          {hasDiscount ? (
            <>
              {/* Giá gốc bị gạch */}
              <InfoRow icon="💰" label="Giá gốc"  val={`${fmtPrice(totalPrice)} VND`} strike />
              {/* Dòng giảm giá voucher */}
              <InfoRow icon="🎫" label="Giảm"     val={`- ${fmtPrice(discount)} VND`} green />
              {/* Giá sau giảm — highlight */}
              <InfoRow icon="✅" label="Sau giảm" val={`${fmtPrice(finalPrice)} VND`} highlight />
            </>
          ) : (
            <InfoRow icon="💰" label="Tổng tiền" val={`${fmtPrice(finalPrice)} VND`} highlight />
          )}

          <InfoRow icon="💳" label="Tiền cọc" val={`${fmtPrice(deposit)} VND`} />

          {/* Badge voucher */}
          {booking.voucher && (
            <div style={{
              marginTop:8, display:"inline-flex", alignItems:"center", gap:4,
              background:"rgba(45,120,85,.08)", border:"1px solid rgba(45,120,85,.2)",
              borderRadius:6, padding:"3px 8px", fontSize:11, color:"#2d7a5f",
            }}>
              🎫 {booking.voucher.code}
            </div>
          )}
        </div>

        {/* Guest info */}
        <div style={{ padding:"16px 20px" }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.35)", marginBottom:10, fontWeight:500 }}>
            Thông tin khách
          </div>
          {gi && !gi.error ? (
            <>
              <InfoRow icon="👤" label="Họ tên" val={gi.fullName} />
              <InfoRow icon="📞" label="SĐT"    val={gi.phoneNumber} />
              <InfoRow icon="🪪" label="CCCD"   val={
                <span style={{ fontFamily:"monospace", letterSpacing:1 }}>{gi.idNumber}</span>
              } />
            </>
          ) : (
            <div style={{ fontSize:12, color:"rgba(12,15,20,.35)", fontStyle:"italic" }}>
              {gi?.error || "Không có dữ liệu"}
            </div>
          )}
          {booking.pointsAwarded > 0 && (
            <div style={{
              marginTop:10, display:"inline-flex", alignItems:"center", gap:4,
              background:"rgba(184,146,42,.08)", border:"1px solid rgba(184,146,42,.2)",
              borderRadius:6, padding:"3px 8px", fontSize:11, color:"#8a6a18",
            }}>
              ⭐ +{booking.pointsAwarded} điểm
            </div>
          )}
        </div>
      </div>

      {/* Voucher discount summary banner — hiện rõ khi có giảm giá */}
      {hasDiscount && (
        <div style={{
          padding:"10px 20px",
          background:"rgba(45,120,85,.05)",
          borderTop:"1px solid rgba(45,120,85,.15)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:4,
          fontSize:12, color:"#2d7a5f",
        }}>
          <span>🎫 Đã áp dụng voucher{booking.voucher ? ` ${booking.voucher.code}` : ""}</span>
          <span style={{ fontWeight:600 }}>Tiết kiệm {fmtPrice(discount)} VND</span>
        </div>
      )}

      {/* Pending notice */}
      {booking.status === "pending" && (
        <div style={{
          padding:"10px 20px", background:"rgba(184,146,42,.06)",
          borderTop:"1px solid rgba(184,146,42,.15)",
          fontSize:12, color:"#8a6a18",
        }}>
          ⏳ Chờ admin xác nhận sau khi nhận cọc <strong>{fmtPrice(deposit)} VND</strong>
        </div>
      )}
    </div>
  );
}
