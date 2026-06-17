import { useState } from "react";
import RoomList from "../components/room/RoomList";
import BookingForm from "../components/booking/BookingForm";

export default function Rooms({ showToast }) {
  const [bookTarget, setBookTarget] = useState(null);

  return (
    <div style={{ padding:"2.5rem", maxWidth:1100, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom:"2.5rem", animation:"fadeIn .4s ease" }}>
        <div style={{ fontSize:10, letterSpacing:3, color:"#b8922a", textTransform:"uppercase", marginBottom:10 }}>
          ✦ Luxury Collection ✦
        </div>
        <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"2.4rem", fontWeight:300, color:"#0c0f14", marginBottom:8 }}>
          Chọn phòng của bạn
        </h1>
        <p style={{ color:"rgba(12,15,20,.45)", fontSize:14 }}>
          Đặt ngay không cần đăng nhập · Đăng nhập để tích điểm đổi voucher
        </p>
        <div style={{ width:56, height:2, background:"linear-gradient(90deg,#b8922a,transparent)", marginTop:14 }} />
      </div>

      <RoomList onBook={room => setBookTarget(room)} />

      {bookTarget && (
        <BookingForm
          room={bookTarget}
          showToast={showToast}
          onClose={() => setBookTarget(null)}
          onSuccess={() => setBookTarget(null)}
        />
      )}
    </div>
  );
}
