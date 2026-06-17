import { useState } from "react";
import bookingApi from "../api/bookingApi";
import BookingCard from "../components/booking/BookingCard";
import Btn from "../components/common/Btn";

export default function GuestLookup() {
  const [phone,    setPhone]    = useState("");
  const [bookings, setBookings] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async () => {
    if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ (9–11 chữ số)"); return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await bookingApi.lookupByPhone(phone.trim());
      setBookings(data);
      setSearched(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding:"2.5rem", maxWidth:760, margin:"0 auto", fontFamily:"var(--font-sans)" }}>

      {/* Header */}
      <div style={{ marginBottom:"2rem", animation:"fadeIn .35s ease" }}>
        <div style={{ fontSize:10, letterSpacing:3, color:"#b8922a", textTransform:"uppercase", marginBottom:10 }}>
          ✦ Tra cứu đặt phòng
        </div>
        <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"2rem", fontWeight:400, color:"#0c0f14", marginBottom:8 }}>
          Tra cứu booking
        </h1>
        <p style={{ color:"rgba(12,15,20,.45)", fontSize:14, lineHeight:1.7 }}>
          Nhập số điện thoại bạn đã dùng khi đặt phòng để xem lại thông tin booking.
        </p>
        <div style={{ width:56, height:2, background:"linear-gradient(90deg,#b8922a,transparent)", marginTop:14 }} />
      </div>

      {/* Search box */}
      <div style={{
        background:"#fff", border:"1.5px solid rgba(12,15,20,.07)",
        borderRadius:16, padding:"24px", marginBottom:24,
        boxShadow:"0 4px 16px rgba(0,0,0,.05)",
      }}>
        <label style={{
          display:"block", fontSize:11, letterSpacing:"1.5px",
          textTransform:"uppercase", color:"rgba(12,15,20,.45)",
          marginBottom:8, fontWeight:500,
        }}>
          Số điện thoại đã đặt phòng
        </label>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ position:"relative", flex:1 }}>
            <span style={{
              position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
              fontSize:16, opacity:.4,
            }}>📞</span>
            <input
              type="tel" inputMode="numeric" maxLength={11}
              placeholder="VD: 0901234567"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleLookup()}
              style={{
                width:"100%", padding:"11px 14px 11px 38px",
                border:"1.5px solid rgba(12,15,20,.09)", borderRadius:10,
                fontFamily:"var(--font-sans)", fontSize:14,
                background:"#fafafa", color:"#0c0f14", outline:"none",
                boxSizing:"border-box",
              }}
            />
          </div>
          <Btn
            onClick={handleLookup}
            disabled={loading}
            style={{ width:"auto", padding:"11px 28px", marginTop:0 }}
          >
            {loading ? "Đang tìm..." : "Tra cứu →"}
          </Btn>
        </div>

        {error && (
          <div style={{
            marginTop:12, padding:"10px 14px", borderRadius:8,
            background:"rgba(192,57,43,.06)", border:"1px solid rgba(192,57,43,.2)",
            fontSize:13, color:"#c0392b",
          }}>
            ✕ {error}
          </div>
        )}

        <p style={{ fontSize:11, color:"rgba(12,15,20,.35)", marginTop:10, lineHeight:1.7 }}>
          🔒 Thông tin chỉ hiển thị với số điện thoại chính xác · Chỉ hiện booking trong 6 tháng gần nhất
        </p>
      </div>

      {/* Results */}
      {searched && (
        bookings?.length > 0 ? (
          <div>
            <div style={{ fontSize:13, color:"rgba(12,15,20,.45)", marginBottom:16 }}>
              Tìm thấy <strong style={{ color:"#0c0f14" }}>{bookings.length}</strong> booking với số điện thoại <strong style={{ color:"#0c0f14" }}>{phone}</strong>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {bookings.map((b, i) => (
                <BookingCard key={b._id} booking={b} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign:"center", padding:"3rem",
            background:"#fff", borderRadius:16,
            border:"1.5px solid rgba(12,15,20,.07)",
          }}>
            <div style={{ fontSize:"2.5rem", marginBottom:12, opacity:.4 }}>📋</div>
            <p style={{ color:"rgba(12,15,20,.45)", fontSize:14 }}>
              Không tìm thấy booking nào với số điện thoại <strong>{phone}</strong>
            </p>
            <p style={{ color:"rgba(12,15,20,.3)", fontSize:12, marginTop:8 }}>
              Kiểm tra lại số điện thoại hoặc booking đã quá 6 tháng
            </p>
          </div>
        )
      )}
    </div>
  );
}
