import { useState } from "react";
import { useAllBookings } from "../../hooks/useBooking";
import axiosClient from "../../api/axiosClient";
import StatusBadge from "../common/StatusBadge";
import Loading from "../common/Loading";
import { fmtDate } from "../../utils/formatDate";
import { fmtPrice } from "../../utils/calculateNights";

function InfoRow({ icon, label, val }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
      <span style={{ fontSize:12, width:18, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:11, color:"rgba(12,15,20,.4)", width:65, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color:"#0c0f14" }}>{val}</span>
    </div>
  );
}

export default function AdminBookings({ showToast }) {
  const { bookings, loading, reload } = useAllBookings();
  const [expanded,  setExpanded]  = useState(null);
  const [actioning, setActioning] = useState(null);

  const confirm = async (id) => {
    setActioning(id);
    try {
      const res = await axiosClient.patch(`/bookings/${id}/confirm`);
      const msg = res.pointsAwarded > 0
        ? `✓ Xác nhận thành công! Đã cộng ${res.pointsAwarded} điểm cho khách.`
        : "✓ Xác nhận booking thành công!";
      showToast?.(msg, "success");
      reload();
    } catch (e) { showToast?.(e.message, "error"); }
    setActioning(null);
  };

  const cancel = async (id) => {
    if (!window.confirm("Hủy booking này?")) return;
    setActioning(id);
    try {
      await axiosClient.patch(`/bookings/${id}/cancel`);
      showToast?.("Đã hủy booking!", "info");
      reload();
    } catch (e) { showToast?.(e.message, "error"); }
    setActioning(null);
  };

  if (loading) return <Loading />;

  if (bookings.length === 0) return (
    <div style={{ textAlign:"center", padding:"4rem", color:"rgba(12,15,20,.35)" }}>
      <div style={{ fontSize:"2.5rem", marginBottom:10, opacity:.4 }}>📋</div>
      <p>Chưa có đặt phòng nào.</p>
    </div>
  );

  return (
    <div style={{
      background:"#fff", border:"1.5px solid rgba(12,15,20,.07)",
      borderRadius:14, overflow:"auto", boxShadow:"0 4px 16px rgba(0,0,0,.05)",
    }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:960 }}>
        <thead>
          <tr style={{ background:"rgba(12,15,20,.025)" }}>
            {["Mã","Phòng","Khách hàng","Check-in","Check-out","Tiền cọc","Booking","Thanh toán","Thao tác"].map(h => (
              <th key={h} style={{
                padding:"11px 12px", textAlign:"left", fontSize:10,
                letterSpacing:1.5, textTransform:"uppercase",
                color:"rgba(12,15,20,.4)", fontWeight:500, whiteSpace:"nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const gi        = b.guestInfo;
            const isExpand  = expanded === b._id;
            const isActing  = actioning === b._id;
            const deposit   = b.depositAmount || Math.ceil((b.finalPrice || b.totalPrice) / 2);
            const finalPrice = b.finalPrice || b.totalPrice;
            const hasDiscount = b.discountAmount > 0;

            return (
              <>
                <tr key={b._id} style={{
                  borderTop:"1px solid rgba(12,15,20,.06)",
                  background: isExpand ? "rgba(184,146,42,.03)" : "transparent",
                }}>
                  <td style={{ padding:"12px", fontSize:11, fontFamily:"monospace", color:"rgba(12,15,20,.5)", whiteSpace:"nowrap" }}>
                    {String(b._id).slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding:"12px", fontSize:13, fontWeight:500, color:"#0c0f14" }}>
                    {b.room?.name || "—"}
                  </td>
                  <td style={{ padding:"12px", fontSize:13, color:"#0c0f14" }}>
                    {gi && !gi.error ? (
                      <div>
                        <div style={{ fontWeight:500 }}>{gi.fullName}</div>
                        <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginTop:1, display:"flex", gap:6 }}>
                          <span>{b.user?.username || "—"}</span>
                          {b.isGuest && (
                            <span style={{
                              background:"rgba(43,74,122,.1)", color:"#2b4a7a",
                              padding:"1px 6px", borderRadius:4, fontSize:10,
                            }}>Vãng lai</span>
                          )}
                        </div>
                      </div>
                    ) : "—"}
                  </td>
                  <td style={{ padding:"12px", fontSize:13, color:"#0c0f14", whiteSpace:"nowrap" }}>{fmtDate(b.checkIn)}</td>
                  <td style={{ padding:"12px", fontSize:13, color:"#0c0f14", whiteSpace:"nowrap" }}>{fmtDate(b.checkOut)}</td>
                  <td style={{ padding:"12px", whiteSpace:"nowrap" }}>
                    <div style={{ fontSize:13, color:"#b8922a", fontWeight:600 }}>{fmtPrice(deposit)} VND</div>
                    <div style={{ fontSize:10, color:"rgba(12,15,20,.35)", marginTop:1 }}>
                      {hasDiscount ? (
                        <span style={{ color:"#2d7a5f" }}>GG {fmtPrice(b.discountAmount)} · {fmtPrice(finalPrice)}</span>
                      ) : (
                        <span>/ {fmtPrice(b.totalPrice)} VND</span>
                      )}
                    </div>
                    {b.voucher && (
                      <div style={{ fontSize:10, color:"#2d7a5f", marginTop:2 }}>🎫 {b.voucher.code}</div>
                    )}
                  </td>
                  <td style={{ padding:"12px" }}><StatusBadge status={b.status} type="booking" /></td>
                  <td style={{ padding:"12px" }}><StatusBadge status={b.paymentStatus || "pending"} type="payment" /></td>
                  <td style={{ padding:"12px" }}>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {b.status === "pending" && (
                        <button onClick={() => confirm(b._id)} disabled={isActing} style={{
                          padding:"5px 10px", border:"none", borderRadius:7,
                          background:"rgba(45,120,85,.9)", color:"#fff",
                          fontFamily:"var(--font-sans)", fontSize:11,
                          cursor: isActing ? "not-allowed" : "pointer",
                          fontWeight:500, whiteSpace:"nowrap", opacity: isActing ? .5 : 1,
                        }}>
                          {isActing ? "..." : "✓ Xác nhận"}
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => cancel(b._id)} disabled={isActing} style={{
                          padding:"5px 10px",
                          border:"1.5px solid rgba(192,57,43,.3)", borderRadius:7,
                          background:"rgba(192,57,43,.06)", color:"#c0392b",
                          fontFamily:"var(--font-sans)", fontSize:11,
                          cursor: isActing ? "not-allowed" : "pointer",
                          fontWeight:500, whiteSpace:"nowrap", opacity: isActing ? .5 : 1,
                        }}>Hủy</button>
                      )}
                      <button onClick={() => setExpanded(isExpand ? null : b._id)} style={{
                        padding:"5px 10px", border:"1.5px solid rgba(12,15,20,.1)",
                        borderRadius:7, background:"transparent", cursor:"pointer",
                        fontFamily:"var(--font-sans)", fontSize:11,
                        color:"rgba(12,15,20,.5)", fontWeight:500, whiteSpace:"nowrap",
                      }}>
                        {isExpand ? "Ẩn ▲" : "Xem ▼"}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded row */}
                {isExpand && (
                  <tr key={`${b._id}-exp`}>
                    <td colSpan={9} style={{ padding:"0 12px 12px" }}>
                      <div style={{
                        background:"rgba(184,146,42,.04)", border:"1px solid rgba(184,146,42,.15)",
                        borderRadius:10, padding:"14px 18px",
                      }}>
                        <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.35)", marginBottom:10, fontWeight:500 }}>
                          🔒 Thông tin khách hàng (đã giải mã)
                        </div>
                        {gi && !gi.error ? (
                          <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                            <InfoRow icon="👤" label="Họ tên"   val={gi.fullName} />
                            <InfoRow icon="📞" label="SĐT"      val={gi.phoneNumber} />
                            <InfoRow icon="🪪" label="CCCD"     val={<span style={{ fontFamily:"monospace", letterSpacing:1 }}>{gi.idNumber}</span>} />
                            <InfoRow icon="✉"  label="Email"    val={b.user?.email || "—"} />
                            <InfoRow icon="💳" label="Tiền cọc" val={`${fmtPrice(deposit)} VND`} />
                            {hasDiscount && <InfoRow icon="🎫" label="Voucher" val={`${b.voucher?.code} (- ${fmtPrice(b.discountAmount)} VND)`} />}
                            {b.pointsAwarded > 0 && <InfoRow icon="⭐" label="Điểm" val={`+${b.pointsAwarded} điểm`} />}
                          </div>
                        ) : (
                          <p style={{ fontSize:13, color:"#c0392b" }}>{gi?.error || "Không có thông tin"}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
